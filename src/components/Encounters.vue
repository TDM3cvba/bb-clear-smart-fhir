<template>
  <div class="container">
    <h1 class="title">E-Invoicing - Encounters</h1>
    <div class="columns is-multiline">
      <button class="button is-success is-small" @click="transactionRequest">Doctar E-Invoice - Patient</button>
 | 
      <button class="button is-danger is-small" @click="incompleteTransactionRequest(false)">Incomplete Request - x-validate = false</button>
 |
      <button class="button is-danger is-small" @click="incompleteTransactionRequest(true)">Incomplete Request - x-validate = true</button>
    </div>
    <div class="notification is-danger" v-if="errorResponse">
      <h2>Http status: {{errorResponse.status}} - {{errorResponse.title}}</h2>
      <ol>
        <li v-for="(value, name, index) in errorResponse.errors" :key="index"><strong>{{name}}</strong>
            <ul>
              <li v-for="item in value" :key="item">{{item}}</li>
              </ul>

        </li>
      </ol>
      </div>
    <div class="timeline">
      <div v-for="(encounter, key) in sortedEncounters" :key="encounter.id">
        <header v-if="key==0" class="timeline-header">
          <span class="tag is-medium is-primary">{{encounter.period.start | getYear}}</span>
        </header>

        <header v-if="key > 0 && yearChange(key)" class="timeline-header">
          <span class="tag is-primary">{{encounter.period.start | getYear}}</span>
        </header>

        <timeline-item :title="encounter.period.start + ' ' + encounter.status">
          <p>
            {{encounter.type[0].text}}
            <span
              v-if="encounter.reasonCode"
            >-{{encounter.reasonCode[0].coding[0].display}}</span>
          </p>

          <button
            class="button is-success is-small"
            @click="transactionRequest(encounter)"
          >E-Invoice With Doctar</button>
        </timeline-item>

        <header v-if="key==sortedEncounters.length - 1" class="timeline-header">
          <span class="tag is-medium is-primary">First record</span>
        </header>
      </div>
    </div>
  </div>
</template>


<script>
import moment from 'moment';
import TimelineItem from './TimelineItem';
import { inspect } from 'util';
export default {
  props: {
    encounters: {
      type: Array
    },
    patient: {
      type: Object
    }, 
    errorResponse : {
      type: Object
    }
  },
  computed: {
    sortedEncounters() {
      // slice: return a shallow copy before sorting, sort is in-place algorithm
      return this.encounters.slice().sort((a, b) => {
        var dateA = new Date(a.period.start);
        var dateB = new Date(b.period.start);
        return dateB - dateA;
      });
    },
    fakeInss() {
      var cleanBirthDay = this.patient.birthDate
        .replace('-', '')
        .replace('-', '');
      var birthday = cleanBirthDay.substr(2, 6);
      var dagteller = cleanBirthDay.substr(cleanBirthDay.length - 3, 3);
      var baseNr = birthday + dagteller;
      var modFunction = function(nr) {
        return 97 - (nr % 97);
      };
      var toCheck = baseNr;
      if (birthday.startsWith('2')) {
        toCheck = '2' + baseNr;
      }

      var checkDigit = modFunction(toCheck);
      var insz = baseNr + checkDigit.toString().padStart(2, '0');
      return insz;
    }
  },
  filters: {
    getYear(date) {
      return moment(date).format('YYYY');
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD');
    }
  },
  methods: {
  
    
    transactionRequest: function(encounter) {
      var mywindow = window.open(); 
      //we open the window on the UI thread, during the user click event, 
      //so the browser doesn't block it as a popup
      //other solution is to make the request fully synchronous     
      var homeAddress = this.patient.address[0];
      var careDate = null;
      var performances = [];
      if (encounter != null && encounter.period != undefined) {
        careDate = encounter.period.start.slice(0, 19); //remove timezone
        performances.push({
          nomenclatureCode : "101076"
        });
        performances.push({
          nomenclatureCode : "101091"
        });
      }
      var inss = this.fakeInss;
      var fakeProvince = "Oost-Vlaanderen";
      var fakeCountry = "BE";
      var fakeNihiiCareProvider = "17385467004";
      var gender = 0;

      switch(this.patient.gender)
      {
          case "male":
            gender = 1;
            break;
          case "female":
            gender = 2;
            break;
      }
      return this.$doctarClient
        .post('/certificates/transaction', {
          careDate: careDate,
          CareReceiver: {
            Inss: inss,
            name: this.patient.name[0].family,
            firstName: this.patient.name[0].given.join(' '),
            birthDate: this.patient.birthDate,
            gender: gender,
            email: this.patient.telecom
              .filter(t => t.system == 'email')
              .map(e => {
                if (e.value && e.value.length > 0) {
                  return e.value;
                }
                return '';
              })
              .join(''),
            InsurabilitySituation: {
              CodeEntitled: {
                ct1: '110',
                ct2: '110'
              },
              mutualityCode: "105"
            },
            address: {
              street: homeAddress.line.join(' '),
              postalCode: homeAddress.postalCode,
              city: homeAddress.city,
              province: fakeProvince,
              country: fakeCountry
            }
          },
          PackageProvider: {
            name: 'demo-fhir-emd'
          },
          CareProvider: {
            Nihii: fakeNihiiCareProvider
          },
          Performances: performances
        })

        .then(response => response.data)
        .then(data => {
          var link = data.links.find(l => l.rel == 'certificate_webflow');
          mywindow.location.href = link.href;
        }).catch(errorResponse => {
          
          this.errorResponse = errorResponse.response.data;
          
        });;
    },
    incompleteTransactionRequest: function(validate) {
      if(validate == false)
      {
          var mywindow = window.open(); 
      }      
      //we open the window on the UI thread, during the user click event, 
      //so the browser doesn't block it as a popup
      //other solution is to make the request fully synchronous     
      var inss = this.fakeInss;
      var config = {};
      if(validate === true)
      {
        config = {
          headers : {
              'x-validate': true
          }          
        }
      };
      var fakeNihiiCareProvider = "17385467004";
      var gender = 0;
      return this.$doctarClient
        .post('/certificates/transaction', {
          CareReceiver: {
            Inss: inss,
          },
          PackageProvider: {
            name: 'demo-fhir-emd'
          },
          CareProvider: {
            Nihii: "invalidriziv"
          }
        }, config)

        
        .then(response => response.data)
        .then(data => {
          var link = data.links.find(l => l.rel == 'certificate_webflow');
          mywindow.location.href = link.href;
        }).catch(errorResponse => {
          
          this.errorResponse = errorResponse.response.data;
          
        });
    },
    yearChange(key) {
      if (key === 0 || key === this.encounters.length - 1) {
        return false;
      }
      const dateA = new Date(this.sortedEncounters[key].period.start);
      const dateB = new Date(this.sortedEncounters[key - 1].period.start);
      if (dateA.getFullYear() !== dateB.getFullYear()) {
        return true;
      }
      return false;
    }
  },
  components: {
    TimelineItem
  }
};
</script>

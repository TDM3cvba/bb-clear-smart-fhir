<template>
  <div id="app" class="section">
    <pulse-loader v-if="loading"></pulse-loader>
    <error v-else-if="error" :error="error"></error>
    <div v-else>
      <patient-demographics :patient="patient"></patient-demographics>
      <hr />
      
      <allergies :allergies="allergyIntolerance"></allergies>
      <hr />
      <medications :medications="medications"></medications>
       <hr />
      <encounters :encounters="encounters" :patient="patient"></encounters>
      <hr />
      <conditions :conditions="conditions"></conditions>
    </div>
  </div>
</template>

<script>
import 'bulma/css/bulma.css';
import 'bulma-timeline/dist/css/bulma-timeline.min.css';

import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

import smartClient from './smartClient';

import Allergies from './components/Allergies';
import Conditions from './components/Conditions';
import Encounters from './components/Encounters';
import Medications from './components/Medications';
import PatientDemographics from './components/PatientDemographics';
import Error from './components/Error';

export default {
  name: 'app',
  components: {
    Allergies,
    Conditions,
    Encounters,
    Medications,
    PatientDemographics,
    PulseLoader,
    Error
  },
  data() {
    return {
      patient: null,
      allergyIntolerance: null,
      medications: null,
      conditions: null,
      loading: true,
      error: null,
      encounters: null
    };
  },
  async mounted() {
    try {
      const smart = await smartClient();
      this.patient = await smart.patient.read();
      this.allergyIntolerance = await smart.patient.api.fetchAll({
        type: 'AllergyIntolerance'
      });
      const medications = await smart.patient.api.search({
        type: 'MedicationRequest',
        query: { patient: this.patient.id }
      });
      if (medications.status === 'success') {
        this.medications =
          medications.data &&
          medications.data.entry &&
          medications.data.entry.map(m => m.resource);
      }
      this.conditions = await smart.patient.api.fetchAll({ type: 'Condition' });
      this.encounters = await smart.patient.api.fetchAll({type: "Encounter"});
      this.loading = false;
    } catch (resp) {
      this.loading = false;
      this.error = resp.error || resp;
    }
  }
};
</script>

<style>
.tile .title {
  font-size: 18px;
}

.tile .subtitle {
  font-size: 16px;
}

.tile ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>

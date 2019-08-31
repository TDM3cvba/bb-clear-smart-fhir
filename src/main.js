import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
const base = axios.create({
  baseURL: 'https://qua-doctarwebtool.azurewebsites.net/Mederi/Doctar.Api/api/v1',
  headers: {
    Authorization: 'ApiKey testkey1'
  }
})

Vue.prototype.$doctarClient = base;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');

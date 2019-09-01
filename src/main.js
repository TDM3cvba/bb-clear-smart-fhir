import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
const base = axios.create({
  baseURL:
    'https://qua-doctarwebtool.azurewebsites.net/Mederi/Doctar.Api/api/v1',
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtYXJ0aWpuLmR1cm5lekB0ZG0zLmJlIiwic3ViIjoiZ2l0aHViLWRlbW8ta2V5IiwiYXVkIjoiZGV2LWRvY3Rhci1hcGkiLCJuYW1lIjoiZ2l0aHViIEVNRCBkZW1vIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1OTg4NjE2MjEsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJlbWQiXX0.C9-L6wR_ubXqz1aq8lgE0N3CQYdt9C6_rF3C3KoH3Rw'
  }
});
Vue.prototype.$doctarClient = base;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');

import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
var demoJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtYXJ0aWpuLmR1cm5lekB0ZG0zLmJlIiwic3ViIjoiZ2l0aHViLWRlbW8ta2V5IiwiYXVkIjoicXVhLWRvY3RhcndlYnRvb2wuYXp1cmV3ZWJzaXRlcy5uZXQvTWVkZXJpL0RvY3Rhci5BcGkiLCJuYW1lIjoiZ2l0aHViIEVNRCBkZW1vIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1OTg4NjE2MjEsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJlbWQiXX0.3dh8YUWHAUYHKi3nnPno5NeDLogfHjBf_qRvOiNW4Yw';

const doctarClient = axios.create({
  baseURL:
    'https://qua-doctarwebtool.azurewebsites.net/Mederi/Doctar.Api/api/v1',
  headers: {
    Authorization:
     'Bearer ' + demoJwtToken
  }
});
Vue.prototype.$doctarClient = doctarClient;
Vue.config.productionTip = false;

export const serverBus = new Vue({
  render: h => h(App)
}).$mount('#app');

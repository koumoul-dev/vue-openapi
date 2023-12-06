import Vue from 'vue'
import VueMaterial from 'vue-material'
import OpenApi from '../src/OpenApi.vue'
import 'vue-material/dist/vue-material.css'
import VueResource from 'vue-resource'

// import jsonApi from './official-examples/api-with-examples.json'
import jsonApi from './dataset-datafair-3.1.json'
// import jsonApi from './multipart.json'

Vue.use(VueResource)
Vue.use(VueMaterial)
Vue.material.registerTheme('default', {
  primary: 'black',
  accent: 'red'
})

new Vue({
  el: '#app',
  template: '<open-api :api="jsonApi" md-theme="\'default\'" :query-params="queryParams" :headers="headers"></open-api>',
  data: () => ({
    jsonApi: jsonApi,
    queryParams: {
      status: ['test']
    },
    headers: {
      api_key: 'myapikey'
    }
  }),
  components: {
    OpenApi
  }
})

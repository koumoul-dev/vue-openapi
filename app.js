import Vue from 'vue'
import VueMaterial from 'vue-material'
import openapi from './OpenAPI.vue'
import 'vue-material/dist/vue-material.css'

import jsonApi from './swagger.json'

Vue.use(VueMaterial)
Vue.material.theme.register('default', {
  primary: 'black',
  accent: 'red'
})

new Vue({
  el: '#app',
  template: '<openapi v-bind:api="jsonApi" v-md-theme="\'default\'"></openapi>',
  data: function(){
    return {
      jsonApi: jsonApi
    }
  },
  components: {
    openapi
  }
})

import Vue from 'vue'
import VueMaterial from 'vue-material'
import OpenApi from '../OpenApi.vue'
import 'vue-material/dist/vue-material.css'
import VueResource from 'vue-resource'

import jsonApi from './petstore.json'

Vue.use(VueResource)
Vue.use(VueMaterial)
Vue.material.registerTheme('default', {
  primary: 'black',
  accent: 'red'
})

new Vue({
  el: '#app',
  template: '<open-api :api="jsonApi" md-theme="\'default\'"></open-api>',
  data: function() {
    return {
      jsonApi: jsonApi
    }
  },
  components: {
    OpenApi
  }
})

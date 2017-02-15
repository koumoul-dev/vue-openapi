import Vue from 'vue'
import VueMaterial from 'vue-material'
import OpenApi from './OpenApi.vue'
import 'vue-material/dist/vue-material.css'

import jsonApi from './swagger.json'

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

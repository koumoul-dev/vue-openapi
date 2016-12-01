import Vue from 'vue'
import VueMaterial from 'vue-material'
import openapi from './OpenAPI.vue'
import 'vue-material/dist/vue-material.css'

Vue.use(VueMaterial)
Vue.material.theme.register('default', {
  primary: 'cyan',
  accent: 'pink'
})

new Vue({
  el: '#app',
  template: '<openapi></openapi>',
  components: {
    openapi
  }
})

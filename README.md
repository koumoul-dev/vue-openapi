# OpenAPI viewer component for VueJS

This [Vue.js](https://vuejs.org/) component is designed to easily browse and test a REST API described
with the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification) (formerly known as Swagger Specification). This component follows Google [Material Design](https://material.google.com/) principles and relies on the [Vue Material](https://github.com/marcosmoura/vue-material) framework.

## Install

TODO (no npm built yet)

## Usage

```
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
```
## License

[MIT License](license.md)

## Similar projects

This project has been inspired by the following projects :

 * [angular-swagger-ui](https://github.com/Orange-OpenSource/angular-swagger-ui)
 * [angular-swagger-ui-material](https://github.com/darosh/angular-swagger-ui-material)

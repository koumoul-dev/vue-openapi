# OpenAPI viewer component for VueJS

This [Vue.js](https://vuejs.org/) component is designed to easily browse and test a REST API described
with the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification) (formerly known as Swagger Specification). This component follows Google [Material Design](https://material.google.com/) principles and relies on the [Vue Material](https://github.com/marcosmoura/vue-material) framework. It also relies on [vue-resource](https://github.com/pagekit/vue-resource) to perform API requests.

See it in action :
 * https://koumoul.com/s/geocoder/api-doc

## Install

npm :
```
npm install --save vue-openapi
```

yarn:
```
yarn add vue-openapi
```

## Usage
```
import Vue from 'vue'
import VueMaterial from 'vue-material'
import OpenApi from 'vue-openapi'
import 'vue-material/dist/vue-material.css'
import VueResource from 'vue-resource'

import jsonApi from './swagger.json'

Vue.use(VueMaterial)
Vue.use(VueResource)

new Vue({
  el: '#app',
  template: '<open-api v-if="jsonApi" :api="jsonApi"></open-api>',
  data: function(){
    return {
      jsonApi: jsonApi
    }
  },
  components: {
    OpenApi
  }
})
```
## License

[MIT License](license.md)

## Similar projects

This project has been inspired by the following projects :

 * [angular-swagger-ui](https://github.com/Orange-OpenSource/angular-swagger-ui)
 * [angular-swagger-ui-material](https://github.com/darosh/angular-swagger-ui-material)

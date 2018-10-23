<template lang="html">
  <md-layout column md-flex="100">
    <md-layout row md-flex="100" v-for="key in Object.keys(properties)" :key="key">
      <!-- File upload -->
      <md-input-container v-if="properties[key].type === 'string' && properties[key].format === 'binary'">
        <label>{{properties[key].title || key}}</label>
        <md-file @selected="files => onFileUpload(key, files)"></md-file>
      </md-input-container>

      <!-- simple enum -->
      <md-input-container v-else-if="properties[key].type === 'array' && properties[key].items.enum">
        <label>{{properties[key].title || key}}</label>
        <md-select v-model="model[key]" multiple>
          <md-option v-for="val in properties[key].items.enum" :key="val" :value="val">{{val}}</md-option>
        </md-select>
      </md-input-container>

      <!-- multi enum -->
      <md-input-container v-else-if="properties[key].enum">
        <label>{{properties[key].title || key}}</label>
        <md-select v-model="model[key]">
          <md-option v-for="val in properties[key].enum" :key="val" :value="val">{{val}}</md-option>
        </md-select>
      </md-input-container>

      <!-- boolean -->
      <md-checkbox v-else-if="properties[key].type === 'boolean'" v-model="model[key]">{{properties[key].title || key}}</md-checkbox>

      <!-- generic input -->
      <md-input-container v-else-if="properties[key].type === 'string' || properties[key].type === 'integer' || properties[key].type === 'number'">
        <label>{{properties[key].title || key}}</label>
        <md-input v-model="model[key]" :type="properties[key].type === 'string' ? 'text' : 'number'"></md-input>
      </md-input-container>

      <!-- objects in textarea -->
      <md-input-container v-else>
        <label>{{properties[key].title || key}}</label>
        <md-textarea v-model="model[key]"></md-textarea>
      </md-input-container>
    </md-layout>
  </md-layout>
</template>

<script>
const FormData = require('form-data')

export default {
  props: ['requestBody'],
  data() {
    return {model: {}}
  },
  computed: {
    properties() {
      return this.requestBody.content['multipart/form-data'].schema.properties
    }
  },
  mounted() {
    Object.keys(this.properties).forEach(key => {
      this.$set(this.model, key, null)
    })
  },
  methods: {
    onFileUpload(key, files) {
      this.model[key] = files[0]
    },
    getFormData() {
      const form = new FormData()
      Object.keys(this.properties)
        .filter(key => this.model[key] !== null)
        .forEach(key => {
          form.append(key, this.model[key])
        })
      return form
    }
  }
}
</script>

<style lang="css">
</style>

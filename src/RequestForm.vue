<template lang="html">
  <form novalidate @submit.stop.prevent="submit" v-if="selectedEntry" id="request-form">
    <md-subheader v-if="selectedEntry.security && selectedEntry.security.filter(s => s.scheme.in !== 'cookie').length">
      Security
    </md-subheader>
    <div v-for="(security, i) in selectedEntry.security.filter(s => s.scheme.in !== 'cookie')" :key="i">
      <md-input-container>
        <label>{{security.scheme.name}}</label>
        <md-input v-model="currentRequest.security[security.scheme.name]" type="string"></md-input>
      </md-input-container>
    </div>

    <md-subheader v-if="selectedEntry.parameters && selectedEntry.parameters.length">
      Parameters
    </md-subheader>
    <div v-for="(parameter, i) in selectedEntry.parameters" :key="i">
      <md-input-container v-if="(parameter.schema.type === 'string' || parameter.schema.type === 'integer' || parameter.schema.type === 'number') && !parameter.schema.enum">
        <label>{{parameter.name}}</label>
        <md-input v-model="currentRequest.params[parameter.name]" :type="parameter.schema.type === 'string' ? 'text' : 'number'"></md-input>
      </md-input-container>

      <md-input-container v-if="parameter.schema.enum">
        <label>{{parameter.name}}</label>
        <md-select v-model="currentRequest.params[parameter.name]">
          <md-option v-for="val in parameter.schema.enum" :key="val" :value="val">{{val}}</md-option>
        </md-select>
      </md-input-container>

      <md-input-container v-if="parameter.schema.type === 'array' && parameter.schema.items.enum">
        <label>{{parameter.name}}</label>
        <md-select v-model="currentRequest.params[parameter.name]" multiple>
          <md-option v-for="val in parameter.schema.items.enum" :key="val" :value="val">{{val}}</md-option>
        </md-select>
      </md-input-container>

      <md-chips v-model="currentRequest.params[parameter.name]" :md-input-placeholder="parameter.name" :md-input-type="parameter.schema.items.type" v-if="parameter.schema.type === 'array' && !parameter.schema.items.enum">
        <template scope="chip">{{ chip.value }}</template>
      </md-chips>

      <md-checkbox v-if="parameter.schema.type === 'boolean'" v-model="currentRequest.params[parameter.name]">{{parameter.name}}</md-checkbox>

    </div>

    <md-subheader v-if="selectedEntry.requestBody">
      Body
    </md-subheader>
    <multipart-form ref="multipartForm" v-if="selectedEntry.requestBody && selectedEntry.requestBody.selectedType === 'multipart/form-data'" :request-body="selectedEntry.requestBody" />
    <md-input-container v-else-if="selectedEntry.requestBody">
      <label for="payload">Payload ({{selectedEntry.requestBody.selectedType}})</label>
      <md-textarea name="payload" v-model="currentRequest.body"></md-textarea>
    </md-input-container>
  </form>
</template>

<script>
import MultipartForm from './MultipartForm.vue'
export default {
  components: {MultipartForm},
  props: ['selectedEntry', 'currentRequest'],
  methods: {
    getFormData() {
      return this.$refs.multipartForm && this.$refs.multipartForm.getFormData()
    }
  }
}
</script>

<style lang="css">
</style>

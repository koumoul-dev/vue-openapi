<template lang="html">
  <form novalidate @submit.stop.prevent="submit" v-if="selectedEntry" id="request-form">
    <md-input-container v-if="selectedEntry.requestBody">
      <label>Payload</label>
      <md-textarea v-model="currentRequest.requestBody"></md-textarea>
    </md-input-container>

    <div v-for="parameter in selectedEntry.parameters">
      <md-input-container v-if="(parameter.schema.type === 'string' || parameter.schema.type === 'integer' || parameter.schema.type === 'number') && !parameter.schema.enum">
        <label>{{parameter.name}}</label>
        <md-input v-model="currentRequest.params[parameter.name]" :type="parameter.schema.type === 'string' ? 'text' : 'number'"></md-input>
      </md-input-container>

      <md-input-container v-if="parameter.schema.enum">
        <label>{{parameter.name}}</label>
        <md-select v-model="currentRequest.params[parameter.name]">
          <md-option v-for="val in parameter.schema.enum" :value="val">{{val}}</md-option>
        </md-select>
      </md-input-container>

      <md-input-container v-if="parameter.schema.type === 'array' && parameter.schema.items.enum">
        <label>{{parameter.name}}</label>
        <md-select v-model="currentRequest.params[parameter.name]" multiple>
          <md-option v-for="val in parameter.schema.items.enum" :value="val">{{val}}</md-option>
        </md-select>
      </md-input-container>

      <md-chips v-model="currentRequest.params[parameter.name]" :md-input-placeholder="parameter.name" :md-input-type="parameter.schema.items.type" v-if="parameter.schema.type === 'array' && !parameter.schema.items.enum">
        <template scope="chip">{{ chip.value }}</template>
      </md-chips>

      <md-checkbox v-if="parameter.schema.type === 'boolean'" v-model="currentRequest.params[parameter.name]">{{parameter.name}}</md-checkbox>

    </div>
  </form>
</template>

<script>
export default {
  props: ['selectedEntry', 'currentRequest']
}
</script>

<style lang="css">
</style>

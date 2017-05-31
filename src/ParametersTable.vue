<template lang="html">
  <md-table v-if="(selectedEntry.parameters && selectedEntry.parameters.length) || selectedEntry.requestBody">
    <md-table-header>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head>Values</md-table-head>
        <md-table-head>Location</md-table-head>
        <md-table-head>Required</md-table-head>
      </md-table-row>
    </md-table-header>

    <md-table-body>
      <md-table-row v-if="selectedEntry.requestBody">
        <md-table-cell>Payload</md-table-cell>
        <md-table-cell>Request body</md-table-cell>
        <md-table-cell v-if="!selectedEntry.requestBody.content"></md-table-cell>
        <md-table-cell v-if="selectedEntry.requestBody.content">
          <md-select v-model="selectedEntry.requestBody.selectedType">
            <md-option v-for="contentType in Object.keys(selectedEntry.requestBody.content)" :key="contentType" :value="contentType">{{contentType}}</md-option>
          </md-select>
        </md-table-cell>
        <md-table-cell v-if="!selectedEntry.requestBody.content || !selectedEntry.requestBody.content[selectedEntry.requestBody.selectedType].schema"></md-table-cell>
        <md-table-cell v-if="selectedEntry.requestBody.content && selectedEntry.requestBody.content[selectedEntry.requestBody.selectedType].schema" style="align-items: left;">
          <md-icon class="md-accent" @click.native="openSchemaDialog(selectedEntry.requestBody.content[selectedEntry.requestBody.selectedType].schema)" style="cursor:pointer" title="View schema">open_in_new</md-icon>
        </md-table-cell>
        <md-table-cell>body</md-table-cell>
        <md-table-cell>
          <md-checkbox v-model="selectedEntry.requestBody.required" disabled></md-checkbox>
        </md-table-cell>
      </md-table-row>


      <md-table-row v-for="(parameter, i) in selectedEntry.parameters" :key="i">
        <md-table-cell>{{parameter.name}}</md-table-cell>
        <md-table-cell v-html="marked(parameter.description)"></md-table-cell>
        <md-table-cell v-if="parameter.schema.type !== 'array'">{{parameter.schema.type}}</md-table-cell>
        <md-table-cell v-if="parameter.schema.type === 'array'">{{parameter.schema.items.type}} array</md-table-cell>
        <md-table-cell v-if="parameter.schema.type !== 'array' && parameter.schema.enum">{{parameter.schema.enum.join(', ')}}</md-table-cell>
        <md-table-cell v-if="parameter.schema.type !== 'array' && !parameter.schema.enum"></md-table-cell>
        <md-table-cell v-if="parameter.schema.type === 'array'">
          <div style="overflow-y:scroll;max-height:200px;">{{(parameter.schema.items.enum || []).join(', ')}}</div>
        </md-table-cell>
        <md-table-cell>{{parameter.in}}</md-table-cell>
        <md-table-cell>
          <md-checkbox v-model="parameter.required" disabled></md-checkbox>
        </md-table-cell>
      </md-table-row>
    </md-table-body>
  </md-table>
</template>

<script>
import marked from 'marked'

export default {
  props: [ 'selectedEntry', 'openSchemaDialog', 'openExamplesDialog' ],
  methods: { marked }
}
</script>

<style lang="css">
</style>

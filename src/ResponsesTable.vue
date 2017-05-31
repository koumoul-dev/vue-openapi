<template lang="html">
  <md-table>
    <md-table-header>
      <md-table-row>
        <md-table-head>HTTP Code</md-table-head>
        <md-table-head>Response</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head>Schema</md-table-head>
        <md-table-head>Examples</md-table-head>
      </md-table-row>
    </md-table-header>

    <md-table-body>
      <md-table-row v-for="(response, code) in selectedEntry.responses" :key="code">
        <md-table-cell>{{code}}</md-table-cell>
        <md-table-cell v-html="marked(response.description)"></md-table-cell>
        <md-table-cell v-if="!response.content"></md-table-cell>
        <md-table-cell v-if="response.content">
          <md-select v-model="response.selectedType">
            <md-option v-for="(value, content) in response.content" :key="content" :value="content">{{content}}</md-option>
          </md-select>
        </md-table-cell>
        <md-table-cell v-if="!response.content || !response.content[response.selectedType].schema"></md-table-cell>
        <md-table-cell v-if="response.content && response.content[response.selectedType].schema">
          <md-icon class="md-accent" @click.native="openSchemaDialog(response.content[response.selectedType].schema)" style="cursor:pointer">open_in_new</md-icon>
        </md-table-cell>
        <md-table-cell v-if="!response.content || !response.content[response.selectedType].examples"></md-table-cell>
        <md-table-cell v-if="response.content && response.content[response.selectedType].examples">
          <md-icon class="md-accent" @click.native="openExamplesDialog(response.content[response.selectedType].examples)" style="cursor:pointer">open_in_new</md-icon>
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

<template lang="html">
  <md-table>
    <md-table-header>
      <md-table-row>
        <md-table-head>HTTP Code</md-table-head>
        <md-table-head>Response</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head>Schema</md-table-head>
        <md-table-head>Headers</md-table-head>
        <md-table-head>Examples</md-table-head>
      </md-table-row>
    </md-table-header>

    <md-table-body>
      <md-table-row v-for="(response, code) in selectedEntry.responses" :key="code">
        <md-table-cell>{{code}}</md-table-cell>
        <md-table-cell v-html="marked(response.description || '')"></md-table-cell>

        <md-table-cell v-if="response.content">
          <md-select v-model="response.selectedType">
            <md-option v-for="(value, content) in response.content" :key="content" :value="content">{{content}}</md-option>
          </md-select>
        </md-table-cell>
        <md-table-cell v-else />

        <md-table-cell v-if="response.content && response.content[response.selectedType].schema">
          <md-icon class="md-accent" @click.native="openSchemaDialog(response.content[response.selectedType].schema)" style="cursor:pointer">open_in_new</md-icon>
        </md-table-cell>
        <md-table-cell v-else />

        <md-table-cell v-if="response.headers">
          <md-icon class="md-accent" @click.native="openFieldsDialog(response.headers)" style="cursor:pointer">open_in_new</md-icon>
        </md-table-cell>
        <md-table-cell v-else />

        <md-table-cell>
          <md-icon class="md-accent" v-if="examples(response)" @click.native="openExamplesDialog(examples(response))" style="cursor:pointer">open_in_new</md-icon>
        </md-table-cell>

      </md-table-row>
    </md-table-body>
  </md-table>
</template>

<script>
import marked from 'marked'

export default {
  props: [ 'selectedEntry', 'openSchemaDialog', 'openExamplesDialog', 'openFieldsDialog'],
  methods: {
    marked,
    examples(response) {
      const content = response.content && response.content[response.selectedType]
      if (content) {
        if (content.example) return {'Example': {summary: 'Default example', value: content.example}}
        if (content.examples) return content.examples
        if (content.schema && content.schema.example) return {'Example': {summary: 'Schema example', value: content.schema.example}}
      }
      return null
    }
  }
}
</script>

<style lang="css">
</style>

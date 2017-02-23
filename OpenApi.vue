<template>
<md-layout md-column>
  <md-layout md-align="center"><h2 class="md-display-1">Documentation for API {{api.servers[0].url}}</h2></md-layout>
  <md-layout md-row>
    <md-layout md-flex="25">
      <md-list class="md-dense" ref="menu">
        <md-list-item v-for="(entries, tag) in tags" md-expand-multiple>
          <span class="md-title">{{tag}}</span>
          <md-list-expand>
            <md-list>
              <md-list-item v-for="entry in entries" @click.native="select(entry)">
                <md-subheader class="md-title" :class="{'md-accent':selectedEntry === entry}" v-html="entry.path.replace(/\//g,'<b>/</b>')"></md-subheader>
                <md-subheader :md-theme="entry.method" class="md-primary">{{entry.method}}</md-subheader>
              </md-list-item>
            </md-list>
          </md-list-expand>
        </md-list-item>
      </md-list>
    </md-layout>

    <md-layout md-flex="75" v-if="selectedEntry" md-column>
      <h3 class="md-headline">{{selectedEntry.summary}}</h3>
      <md-layout>
        <md-button class="md-raised md-primary" @click.native="openSidenav">Make request</md-button>
      </md-layout>
      <!-- <div v-if="selectedEntry.description">
        <h4>Implementation Notes</h4> {{selectedEntry.description}}
      </div> -->

      <h4 v-if="selectedEntry.parameters">Parameters</h4>
      <md-table v-if="selectedEntry.parameters">
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
          <md-table-row v-for="parameter in selectedEntry.parameters">
            <md-table-cell>{{parameter.name}}</md-table-cell>
            <md-table-cell v-html="parameter.description"></md-table-cell>
            <md-table-cell v-if="parameter.schema.type !== 'array'">{{parameter.schema.type}}</md-table-cell>
            <md-table-cell v-if="parameter.schema.type === 'array'">{{toDash(parameter.style)}} {{parameter.schema.items.type}}</md-table-cell>
            <md-table-cell v-if="parameter.schema.type !== 'array' && parameter.schema.enum">{{parameter.schema.enum.join(', ')}}</md-table-cell>
            <md-table-cell v-if="parameter.schema.type !== 'array' && !parameter.schema.enum"></md-table-cell>
            <md-table-cell v-if="parameter.schema.type === 'array'"><div style="overflow-y:scroll;max-height:200px;">{{(parameter.schema.items.enum || []).join(', ')}}</div></md-table-cell>
            <md-table-cell>{{parameter.in}}</md-table-cell>
            <md-table-cell>
              <md-checkbox v-model="parameter.required" disabled></md-checkbox>
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>

      <h4>Responses</h4>
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
          <md-table-row v-for="(response, code) in selectedEntry.responses">
            <md-table-cell>{{code}}</md-table-cell>
            <md-table-cell>{{response.description}}</md-table-cell>
            <md-table-cell v-if="!response.content"></md-table-cell>
            <md-table-cell v-if="response.content">
              <md-select v-model="response.selectedType">
                <md-option v-for="(value, content) in response.content" :value="content">{{content}}</md-option>
              </md-select>
            </md-table-cell>
            <md-table-cell v-if="!response.content || !response.content[response.selectedType].schema"></md-table-cell>
            <md-table-cell v-if="response.content && response.content[response.selectedType].schema">
              <md-icon class="md-accent" @click.native="openSchemaDialog(response.content[response.selectedType].schema)" style="cursor:pointer">open_in_new</md-icon>
            </md-table-cell>
            <md-table-cell v-if="!response.content || !response.content[response.selectedType].examples"></md-table-cell>
            <md-table-cell v-if="response.content && response.content[response.selectedType].examples">
              <md-icon class="md-accent" @click.native="openExamplesDialog(response.content[response.selectedType].examples.join('<hr>'))" style="cursor:pointer">open_in_new</md-icon>
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>

    </md-layout>
  </md-layout>

  <md-dialog-alert :md-content-html="currentSchema" md-title="Schema" ref="schemaDialog"></md-dialog-alert>
  <md-dialog-alert :md-content-html="currentExamples" md-title="Examples" ref="examplesDialog"></md-dialog-alert>

  <md-sidenav class="md-right" ref="sidenav">
    <md-toolbar>
      <div class="md-toolbar-container">
        <h3 class="md-title">{{selectedEntry && selectedEntry.method.toUpperCase()}} {{selectedEntry && selectedEntry.path}}</h3>
        <span style="flex:1"></span>
        <md-button class="md-raised md-accent md-icon-button" @click.native="closeSidenav">
          <md-icon>close</md-icon>
        </md-button>
      </div>
    </md-toolbar>
    <md-layout md-gutter md-column style="padding: 16px;">
      <h2>Request</h2>
      <form novalidate @submit.stop.prevent="submit" v-if="selectedEntry" id="request-form">
        <div v-for="parameter in selectedEntry.parameters">
          <md-input-container v-if="(parameter.schema.type === 'string' || parameter.schema.type === 'integer' || parameter.schema.type === 'number') && !parameter.schema.enum">
            <label>{{parameter.description}}</label>
            <md-input v-model="currentRequest[parameter.name]" :type="parameter.schema.type === 'string' ? 'text' : 'number'" :placeholder="parameter.name"></md-input>
          </md-input-container>

          <md-input-container v-if="parameter.schema.enum">
            <label>{{parameter.description}}</label>
            <md-select v-model="currentRequest[parameter.name]" :placeholder="parameter.name">
              <md-option v-for="val in parameter.schema.enum" :value="val">{{val}}</md-option>
            </md-select>
          </md-input-container>

          <md-input-container v-if="parameter.schema.type === 'array' && parameter.schema.items.enum">
            <label>{{parameter.description}}</label>
            <md-select v-model="currentRequest[parameter.name]" multiple :placeholder="parameter.name">
              <md-option v-for="val in parameter.schema.items.enum" :value="val">{{val}}</md-option>
            </md-select>
          </md-input-container>

          <md-chips v-model="currentRequest[parameter.name]" :md-input-placeholder="parameter.name" :md-input-type="parameter.schema.items.type" v-if="parameter.schema.type === 'array' && !parameter.schema.items.enum">
            <template scope="chip">{{ chip.value }}</template>
          </md-chips>

          <md-checkbox v-if="parameter.schema.type === 'boolean'" v-model="currentRequest[parameter.name]">{{parameter.name}}<md-tooltip md-direction="top">{{parameter.description}}</md-tooltip></md-checkbox>

        </div>
      </form>
      <md-layout>
        <md-button class="md-raised md-accent" @click.native="request">Request</md-button>
      </md-layout>

      <h2>Response</h2>
      <pre>
        {{currentResponse}}
      </pre>
    </md-layout>
  </md-sidenav>

</md-layout>
</template>

<style>
.md-right .md-sidenav-content {
  width: 500px;
}

#request-form {
  padding: 16px;
}
</style>

<script>
export default {
  name: 'open-api',
  props: ['api'],
  data: () => ({
    selectedEntry: null,
    currentSchema: ' ',
    currentExamples: ' ',
    currentRequest: {},
    currentResponse: ''
  }),
  mounted: function() {
    this.$refs.menu.$children[0].toggleExpandList()
    this.$material.registerTheme({
      get: {
        primary: 'blue'
      },
      post: {
        primary: 'green'
      },
      put: {
        primary: 'orange'
      },
      delete: {
        primary: 'red'
      }
    })
  },
  computed: {
    tags: function() {
      var tags = {}
      var self = this
      Object.keys(self.api.paths).forEach(function(path) {
        Object.keys(self.api.paths[path]).forEach(function(method) {
          let entry = self.api.paths[path][method]
          entry.method = method
          entry.path = path
            // Filling tags entries
          self.api.paths[path][method].tags = self.api.paths[path][method].tags ||  []
          if (!self.api.paths[path][method].tags.length) {
            self.api.paths[path][method].tags.push('No category')
          }
          self.api.paths[path][method].tags.forEach(function(tag) {
              tags[tag] = tags[tag] || []
              tags[tag].push(entry)
            })
            // Some preprocessing with responses
          Object.values(entry.responses).forEach(response => {
            if (response.content) {
              // preselecting responses mime-type
              response.selectedType = Object.keys(response.content)[0]
              Object.values(response.content).forEach(contentType => {
                // Spec allow an item or an array, we always fall back on an array of examples
                if (contentType.example) {
                  contentType.examples = contentType.examples || []
                  contentType.examples.push(contentType.example)
                }
                if (contentType.examples) {
                  contentType.examples = contentType.examples.map(e => '<pre>' + JSON.stringify(e, null, 2) + '</pre>')
                }
                if (contentType.schema) {
                  contentType.schema = '<pre>' + JSON.stringify(contentType.schema, null, 2) + '</pre>'
                }
              })
            }
          })
        })
      })
      return tags
    }
  },
  methods: {
    resetRequest(entry) {
      for (var p in this.currentRequest) delete this.currentRequest[p]
      this.currentRequest = Object.assign({}, this.currentRequest, ...(entry.parameters || []).map(p => ({
        [p.name]: p.schema.enum ? p.schema.enum[0] : (p.schema.type === 'array' ? [] : null)
      })))
    },
    select(entry) {
      this.resetRequest(entry)
      this.selectedEntry = entry
    },
    openSchemaDialog(schema) {
      this.currentSchema = schema
      this.$refs.schemaDialog.open()
    },
    openExamplesDialog(examples) {
      this.currentExamples = examples
      this.$refs.examplesDialog.open()
    },
    openSidenav() {
      this.resetRequest(this.selectedEntry)
      this.currentResponse = ''
      this.$refs.sidenav.open()
    },
    closeSidenav() {
      this.$refs.sidenav.close()
    },
    request() {
      this.currentResponse = ''
      let params = Object.assign({}, ...(this.selectedEntry.parameters || []).filter(p => p.in === 'query' && (p.schema.type === 'array' ? this.currentRequest[p.name].length : this.currentRequest[p.name]))
        .map(p => ({
          // TODO : join character for array should depend of p.style
          [p.name]: p.schema.type === 'array' ? this.currentRequest[p.name].join(',') : this.currentRequest[p.name]
        }))
      )
      this.$http({
        method: this.selectedEntry.method,
        url: this.api.servers[0].url + this.selectedEntry.path.replace(/{(\w*)}/g, (m, key) => {
          return this.currentRequest[key]
        }),
        params
      }).then(response => {
        this.currentResponse = JSON.stringify(response.body, null, 2)
      }, response => {
        this.currentResponse = JSON.stringify(response.body, null, 2)
      })
    },
    toDash(str) {
      return str.replace(/([A-Z])/g, function($1) {
        return "-" + $1.toLowerCase()
      })
    }
  }
}
</script>

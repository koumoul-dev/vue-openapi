<template>
<div class="openapi">
  <md-layout md-column>
    <md-layout md-row md-flex="90" md-align="center">
      <md-layout md-column md-flex="65">
        <h2 class="md-display-2">{{api.info.title}}</h2>
        <div v-html="marked(api.info.description)"></div>
      </md-layout>
      <md-layout md-flex="5"></md-layout>
      <md-layout md-column md-flex="20">
        <md-layout md-flex="true"></md-layout>
        <md-card>
          <md-list>
            <md-list-item>
              <md-icon>home</md-icon> <span><a :href="api.info.contact.url">{{api.info.contact.name}}</a></span>
            </md-list-item>
            <md-list-item>
              <md-icon>email</md-icon> <span><a :href="'mailto:'+api.info.contact.email">{{api.info.contact.email}}</a></span>
            </md-list-item>
            <md-list-item>
              <md-icon>label</md-icon> <span>{{api.info.version}}</span>
            </md-list-item>
            <md-list-item>
              <md-icon>description</md-icon> <span><a :href="api.info.termsOfService">Terms of Service</a></span>
            </md-list-item>
          </md-list>
        </md-card>
        <md-layout md-flex="true"></md-layout>
      </md-layout>
    </md-layout>

    <md-layout md-row style="flex-wrap: nowrap;">
      <md-list class="md-dense" ref="menu">
          <md-list-item v-for="(entries, tag) in tags" :key="tag" md-expand-multiple>
            <span class="md-title">{{tag}}</span>
            <md-list-expand>
              <md-list>
                <md-list-item v-for="(entry, i) in entries" :key="i" @click.native="select(entry)">
                  <md-subheader class="md-title" :class="{'md-accent':selectedEntry === entry}" v-html="entry.path.replace(/\//g,'<b>/</b>')"></md-subheader>
                  <md-subheader :md-theme="entry.method" class="md-primary">{{entry.method}}</md-subheader>
                </md-list-item>
              </md-list>
            </md-list-expand>
          </md-list-item>
      </md-list>


      <md-layout md-flex-offset="5" md-flex="true" v-if="!selectedEntry">
        <p>Select an entry on the left to see detailed information...</p>
      </md-layout>

      <md-layout md-column md-flex-offset="5" md-flex="true" v-if="selectedEntry">

          <h3 class="md-headline">{{selectedEntry.summary}}</h3>
          <div>
            <md-button class="md-raised md-primary" @click.native="openSidenav">Make request</md-button>
          </div>

          <!-- <div v-if="selectedEntry.description">
          <h4>Implementation Notes</h4> {{selectedEntry.description}}
        </div> -->

          <h4 v-if="(selectedEntry.parameters && selectedEntry.parameters.length) || selectedEntry.requestBody">Parameters</h4>
          <parameters-table :selectedEntry="selectedEntry" :openSchemaDialog="openSchemaDialog" :openExamplesDialog="openExamplesDialog"></parameters-table>

          <h4>Responses</h4>
          <responses-table :selectedEntry="selectedEntry" :openSchemaDialog="openSchemaDialog" :openExamplesDialog="openExamplesDialog"></responses-table>

      </md-layout>
    </md-layout>
  </md-layout>

  <md-dialog ref="schemaDialog" class="schema-dialog">
    <md-dialog-title>Schema</md-dialog-title>

    <md-dialog-content>
      <md-tabs>
        <md-tab id="tree" md-label="Tree">
          <schema-view :schema="currentSchema"></schema-view>
        </md-tab>
        <md-tab id="raw" md-label="Raw">
<pre>{{ JSON.stringify(currentSchema, null, 2)}}</pre>
        </md-tab>
      </md-tabs>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button @click.native="$refs.schemaDialog.close()">ok</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog-alert :md-content-html="currentExamples.map(example => `<pre>${JSON.stringify(example, null, 2)}</pre>`).join('<br>') + ' '" md-title="Examples" ref="examplesDialog"></md-dialog-alert>

  <md-sidenav class="md-right" ref="sidenav">
    <md-toolbar>
      <div class="md-toolbar-container">
        <h3 class="md-title">{{selectedEntry && selectedEntry.method.toUpperCase()}} {{selectedEntry && selectedEntry.path}}</h3>
        <span style="flex:1"></span>
        <md-button class="md-icon-button" @click.native="closeSidenav">
          <md-icon>close</md-icon>
        </md-button>
      </div>
    </md-toolbar>
    <md-layout md-gutter md-column style="padding: 16px;">
      <h2>Request</h2>
      <request-form :selectedEntry="selectedEntry" :currentRequest="currentRequest"></request-form>
      <md-layout>
        <md-button class="md-raised md-accent" @click.native="request">Request</md-button>
      </md-layout>

      <h2>Response</h2>
      <pre>
{{currentResponse}}
      </pre>
    </md-layout>
  </md-sidenav>

</div>
</template>

<style lang="css">
.openapi {
   position:relative;
   overflow-x:hidden;
   height:100%;
}

.openapi .md-right .md-sidenav-content {
  width: 500px;
}

.openapi #request-form {
  padding: 16px;
}

.openapi .md-table .md-table-cell.md-has-action .md-table-cell-container {
  display: inherit;
}

.schema-dialog .md-dialog {
  min-width: 800px;
}
</style>

<script>
import Vue from 'vue'
import marked from 'marked'
import RequestForm from './RequestForm.vue'
import ResponsesTable from './ResponsesTable.vue'
import ParametersTable from './ParametersTable.vue'
import SchemaView from './SchemaView.vue'

export default {
  name: 'open-api',
  components: { RequestForm, ResponsesTable, ParametersTable, SchemaView },
  props: ['api'],
  data: () => ({
    selectedEntry: null,
    currentSchema: ' ',
    currentExamples: [],
    currentRequest: {
      contentType: '',
      body: ''
    },
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
      return getTag(this.api)
    }
  },
  methods: {
    marked,
    select(entry) {
      reset(this.currentRequest, entry)
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
      reset(this.currentRequest, this.selectedEntry)
      this.currentResponse = ''
      this.$refs.sidenav.open()
    },
    closeSidenav() {
      this.$refs.sidenav.close()
    },
    request() {
      this.currentResponse = ''
      fetch(this.currentRequest, this.selectedEntry, this.api).then(res => {
        this.currentResponse = JSON.stringify(res.body, null, 2)
      }, res => {
        this.currentResponse = JSON.stringify(res.body, null, 2)
      })
    }
  }
}

/*
 * HTTP requests utils
 */

function reset(request, entry) {
  request.params = Object.assign({}, ...(entry.parameters || []).map(p => ({
    [p.name]: p.schema.enum ? p.schema.enum[0] : (p.schema.type === 'array' ? [] : null)
  })))
  if (entry.requestBody) {
    request.contentType = entry.requestBody.selectedType
    const example = entry.requestBody.content[request.contentType].example
    request.body = typeof example === 'string' ? example : JSON.stringify(example, null, 2)
  }
}

function fetch(request, entry, api) {
  let params = Object.assign({}, ...(entry.parameters || [])
    .filter(p => p.in === 'query' && (p.schema.type === 'array' ? request.params[p.name].length : request.params[p.name]))
    .map(p => ({
      // TODO : join character for array should depend of p.style
      [p.name]: p.schema.type === 'array' ? request.params[p.name].join(',') : request.params[p.name]
    }))
  )
  let headers = Object.assign({}, ...(entry.parameters || [])
    .filter(p => p.in === 'header' && (p.schema.type === 'array' ? request.params[p.name].length : request.params[p.name]))
    .map(p => ({
      // TODO : join character for array should depend of p.style
      [p.name]: p.schema.type === 'array' ? request.params[p.name].join(',') : request.params[p.name]
    }))
  )
  const httpRequest = {
    method: entry.method,
    url: api.servers[0].url + entry.path.replace(/{(\w*)}/g, (m, key) => {
      return request.params[key]
    }),
    params,
    headers
  }
  if (entry.requestBody) {
    httpRequest.headers['Content-type'] = request.contentType
    httpRequest.body = request.body
  }
  return Vue.http(httpRequest)
}

/*
 * Tags management utils
 */

 import deref from 'json-schema-deref-local'

 const defaultStyle = {
   query: 'form',
   path: 'simple',
   header: 'simple',
   cookie: 'form'
 }

 function processContent(contentType, api) {
   // Spec allow examples as an item or an array. In the API or in the schema
   // we always fall back on an array
   if (contentType.schema) {
     contentType.examples = contentType.examples || contentType.schema.examples
     contentType.example = contentType.example || contentType.schema.example
   }

   if (contentType.example) {
     contentType.examples = [contentType.example]
   }
 }

function getTag(api) {
   const derefAPI = deref(api)
   var tags = {}
   Object.keys(derefAPI.paths).forEach(function(path) {
     Object.keys(derefAPI.paths[path]).forEach(function(method) {
       let entry = derefAPI.paths[path][method]
       entry.method = method
       entry.path = path
         // Filling tags entries
       entry.tags = entry.tags || []
       if (!entry.tags.length) {
         entry.tags.push('No category')
       }
       entry.tags.forEach(function(tag) {
         tags[tag] = tags[tag] || []
         tags[tag].push(entry)
       })
       if (entry.parameters) {
         entry.parameters.forEach(p => {
           p.style = p.style || defaultStyle[p.in]
           p.explode = p.explode || (p.style === 'form')
           p.schema = p.schema || {
             type: 'string'
           }
         })
       }
       if (entry.requestBody) {
         if (entry.requestBody.content) {
           Vue.set(entry.requestBody, 'selectedType', Object.keys(entry.requestBody.content)[0])
           entry.requestBody.required = true
           Object.values(entry.requestBody.content).forEach(contentType => processContent(contentType, api))
         }
       }

       // Some preprocessing with responses
       Object.values(entry.responses).forEach(response => {
         if (response.content) {
           // preselecting responses mime-type
           Vue.set(response, 'selectedType', Object.keys(response.content)[0])
           Object.values(response.content).forEach(contentType => processContent(contentType, api))
         }
       })
     })
   })
   return tags
 }

</script>

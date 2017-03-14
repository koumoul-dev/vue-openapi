<template>
<div style="position:relative;overflow-x:hidden;flex:1;">
  <md-layout md-column>
    <!-- <md-layout md-align="center">
      <md-layout md-flex="80" md-align="center">
        <h2 class="md-display-2">Documentation de l'API</h2>
      </md-layout>

      <md-layout md-flex="80" md-align="center">
        <p>Cette documentation s'adresse aux développeurs et décrit l'ensemble des opérations de l'API entreprise.
          Le format de cette documentation est basé sur la spécification <a href="https://www.openapis.org/">OpenAPI 3.0</a> qui est le successeur de Swagger.
          Cette documentation peut être chargée dans n'importe quel lecteur compatible avec le format OpenAPI 3.0 en utilisant le lien vers le <a href='./api-docs.json'>fichier source</a>.
        </p>
      </md-layout>

      <md-layout md-flex="80" md-align="center">
        <p>Cette API est utilisable gratuitement sans conditions, mais l'utilisation est alors très réduite. Pour pouvoir l'utiliser plus largement, il faut créer un compte sur <a href="https://koumoul.com">notre site</a> et utiliser votre <a href="/t/my-access">jeton d'authentification</a> pour faire les requêtes. Vous trouverez plus de détails sur les plans et conditions d'utilisation de nos service <a href="/t/">à cette page</a>.</p>
      </md-layout>
    </md-layout> -->
    <md-layout md-row md-flex="90" md-align="center">
      <md-layout md-column md-flex="65">
        <md-layout>
          <h2 class="md-display-2">{{api.info.title}}</h2>
        </md-layout>
        <md-layout v-html="marked(api.info.description)"></md-layout>
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
        <!-- <div><img src="../../assets/population.svg" alt="logo datainfogreffe.fr" style="height:300px;"></div> -->
      </md-layout>
    </md-layout>

    <md-layout md-row>
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

      <md-layout md-flex-offset="5" md-flex="true" v-if="selectedEntry">
        <md-layout md-column>
          <h3 class="md-headline">{{selectedEntry.summary}}</h3>
          <div>
            <md-button class="md-raised md-primary" @click.native="openSidenav">Make request</md-button>
          </div>

          <!-- <div v-if="selectedEntry.description">
          <h4>Implementation Notes</h4> {{selectedEntry.description}}
        </div> -->


          <h4 v-if="(selectedEntry.parameters && selectedEntry.parameters.length) || selectedEntry.requestBody">Parameters</h4>
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
                    <md-option v-for="(value, content) in selectedEntry.requestBody.content" :value="content">{{content}}</md-option>
                  </md-select>
                </md-table-cell>
                <md-table-cell v-if="!selectedEntry.requestBody.content || !selectedEntry.requestBody.content[selectedEntry.requestBody.selectedType].schema"></md-table-cell>
                <md-table-cell v-if="selectedEntry.requestBody.content && selectedEntry.requestBody.content[selectedEntry.requestBody.selectedType].schema">
                  <md-icon class="md-accent" @click.native="openSchemaDialog(selectedEntry.requestBody.content[selectedEntry.requestBody.selectedType].schemaHTML)" style="cursor:pointer">open_in_new</md-icon>
                </md-table-cell>
                <md-table-cell>body</md-table-cell>
                <md-table-cell>
                  <md-checkbox v-model="selectedEntry.requestBody.required" disabled></md-checkbox>
                </md-table-cell>
              </md-table-row>


              <md-table-row v-for="parameter in selectedEntry.parameters">
                <md-table-cell>{{parameter.name}}</md-table-cell>
                <md-table-cell v-html="marked(parameter.description)"></md-table-cell>
                <md-table-cell v-if="parameter.schema.type !== 'array'">{{parameter.schema.type}}</md-table-cell>
                <md-table-cell v-if="parameter.schema.type === 'array'">{{parameter.schema.items.type}} {{parameter.schema.type}}</md-table-cell>
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
                <md-table-cell v-html="marked(response.description)"></md-table-cell>
                <md-table-cell v-if="!response.content"></md-table-cell>
                <md-table-cell v-if="response.content">
                  <md-select v-model="response.selectedType">
                    <md-option v-for="(value, content) in response.content" :value="content">{{content}}</md-option>
                  </md-select>
                </md-table-cell>
                <md-table-cell v-if="!response.content || !response.content[response.selectedType].schema"></md-table-cell>
                <md-table-cell v-if="response.content && response.content[response.selectedType].schema">
                  <md-icon class="md-accent" @click.native="openSchemaDialog(response.content[response.selectedType].schemaHTML)" style="cursor:pointer">open_in_new</md-icon>
                </md-table-cell>
                <md-table-cell v-if="!response.content || !response.content[response.selectedType].examples"></md-table-cell>
                <md-table-cell v-if="response.content && response.content[response.selectedType].examples">
                  <md-icon class="md-accent" @click.native="openExamplesDialog(response.content[response.selectedType].examples.join('<hr>'))" style="cursor:pointer">open_in_new</md-icon>
                </md-table-cell>
              </md-table-row>
            </md-table-body>
          </md-table>
          <md-layout md-flex="true"></md-layout>
        </md-layout>
      </md-layout>
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
            <template scope="chip">{{ chip.value }}
</template>
          </md-chips>

          <md-checkbox v-if="parameter.schema.type === 'boolean'" v-model="currentRequest.params[parameter.name]">{{parameter.name}}</md-checkbox>

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

</div>
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
import get from 'lodash.get'
import marked from 'marked'

const defaultStyle = {
  query: 'form',
  path: 'simple',
  header: 'simple',
  cookie: 'form'
}

function processContent(contentType, api) {
  // Spec allow an item or an array, we always fall back on an array of examples
  if (contentType.example) {
    contentType.examples = contentType.examples || []
    contentType.examples.push(contentType.example)
  }
  if (contentType.examples) {
    if (!contentType.example && contentType.examples.length) {
      contentType.example = contentType.examples[0]
    }
    contentType.examples = contentType.examples.map(e => '<pre>' + JSON.stringify(e, null, 2) + '</pre>')
  }
  if (contentType.schema) {
    if (contentType.schema.$ref) {
      contentType.schema = get(api, contentType.schema.$ref.split('#/').pop().replace(/\//g, '.'))
    } else if (contentType.schema.items && contentType.schema.items.$ref) {
      contentType.schema.items = get(api, contentType.schema.items.$ref.split('#/').pop().replace(/\//g, '.'))
    }
    if (typeof contentType.schema !== 'string') {
      contentType.schemaHTML = '<pre>' + JSON.stringify(contentType.schema, null, 2) + '</pre>'
    }
  }
}

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
          entry.tags = entry.tags ||  []
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
            if (entry.requestBody.$ref) {
              entry.requestBody = get(self.api, entry.requestBody.$ref.split('#/').pop().replace(/\//g, '.'))
            }
            if (entry.requestBody.content) {
              entry.requestBody.selectedType = Object.keys(entry.requestBody.content)[0]
              entry.requestBody.required = true
              Object.values(entry.requestBody.content).forEach(contentType => processContent(contentType, self.api))
            }
          }

          // Some preprocessing with responses
          Object.values(entry.responses).forEach(response => {
            if (response.content) {
              // preselecting responses mime-type
              response.selectedType = Object.keys(response.content)[0]
              Object.values(response.content).forEach(contentType => processContent(contentType, self.api))
            }
          })
        })
      })
      return tags
    }
  },
  methods: {
    marked,
    resetRequest(entry) {
      // for (var p in this.currentRequest) delete this.currentRequest[p]

      this.currentRequest.params = Object.assign({}, ...(entry.parameters || []).map(p => ({
        [p.name]: p.schema.enum ? p.schema.enum[0] : (p.schema.type === 'array' ? [] : null)
      })))
      if (entry.requestBody) {
        this.currentRequest.contentType = Object.keys(entry.requestBody.content)[0]
        this.currentRequest.requestBody = entry.requestBody.content[this.currentRequest.contentType].example ||  ''
      }
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
      let params = Object.assign({}, ...(this.selectedEntry.parameters || []).filter(p => p.in === 'query' && (p.schema.type === 'array' ? this.currentRequest.params[p.name].length : this.currentRequest.params[p.name]))
        .map(p => ({
          // TODO : join character for array should depend of p.style
          [p.name]: p.schema.type === 'array' ? this.currentRequest.params[p.name].join(',') : this.currentRequest.params[p.name]
        }))
      )
      let headers = Object.assign({}, ...(this.selectedEntry.parameters || []).filter(p => p.in === 'header' && (p.schema.type === 'array' ? this.currentRequest.params[p.name].length : this.currentRequest.params[p.name]))
        .map(p => ({
          // TODO : join character for array should depend of p.style
          [p.name]: p.schema.type === 'array' ? this.currentRequest.params[p.name].join(',') : this.currentRequest.params[p.name]
        }))
      )
      let request = {
        method: this.selectedEntry.method,
        url: this.api.servers[0].url + this.selectedEntry.path.replace(/{(\w*)}/g, (m, key) => {
          return this.currentRequest.params[key]
        }),
        params,
        headers
      }
      if (this.selectedEntry.requestBody) {
        request.headers['Content-type'] = this.currentRequest.contentType
        request.body = this.currentRequest.requestBody
      }
      this.$http(request).then(response => {
        this.currentResponse = JSON.stringify(response.body, null, 2)
      }, response => {
        this.currentResponse = JSON.stringify(response.body, null, 2)
      })
    }
  }
}
</script>

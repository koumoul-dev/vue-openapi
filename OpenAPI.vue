<template>
<div>
  <md-list>
    <md-list-item v-for="(entries, tag) in tags">
      <!-- <md-icon>whatshot</md-icon> -->
      <span class="md-headline">{{tag}}</span>

      <md-list-expand>
        <md-list>
          <md-list-item class="md-inset" v-for="entry in entries">
            <span class="md-title"><md-button class="md-raised md-default">{{entry.method}}</md-button>{{entry.path}}</span><span style="float:right">{{entry.summary}}</span>
            <md-list-expand>
              <div v-if="entry.description">
                <h4>Implementation Notes</h4>
                {{entry.description}}
              </div>

              <h4>Parameters</h4>
              <md-table>
                <md-table-header>
                  <md-table-row>
                    <md-table-head>Parameter</md-table-head>
                    <md-table-head>Value</md-table-head> <!-- md-tooltip="The total amount of food energy and the given serving size" -->
                    <md-table-head>Description</md-table-head>
                    <md-table-head>Parameter Type</md-table-head>
                    <md-table-head>Data Type</md-table-head>
                  </md-table-row>
                </md-table-header>

                <md-table-body>
                  <md-table-row v-for="parameter in entry.parameters">
                    <md-table-cell>{{parameter.name}}</md-table-cell>
                    <md-table-cell>{{parameter.name}}</md-table-cell>
                    <md-table-cell>{{parameter.description}}</md-table-cell>
                    <md-table-cell>{{parameter.in}}</md-table-cell>
                    <md-table-cell>{{parameter.type}}</md-table-cell>
                  </md-table-row>
                </md-table-body>
              </md-table>

              <h4>Responses</h4>
              <md-table>
                <md-table-header>
                  <md-table-row>
                    <md-table-head>HTTP Status Code</md-table-head>
                    <md-table-head>Reason</md-table-head> <!-- md-tooltip="The total amount of food energy and the given serving size" -->
                    <md-table-head>Response Model</md-table-head>
                    <md-table-head>Headers</md-table-head>
                  </md-table-row>
                </md-table-header>

                <md-table-body>
                  <md-table-row v-for="(response, code) in entry.responses">
                    <md-table-cell>{{code}}</md-table-cell>
                    <md-table-cell>{{response.description}}</md-table-cell>
                    <md-table-cell>{{response.schema}}</md-table-cell>
                    <md-table-cell>{{response.headers}}</md-table-cell>
                  </md-table-row>
                </md-table-body>
              </md-table>

              <md-button class="md-raised md-primary">Request !</md-button>
              <!-- <md-input-container>
                <label for="accept">Response Content Type</label>
                <md-select name="accept" id="accept" >
                  <md-option value="type" v-for="type in entry.produces">{{type}}</md-option>
                </md-select>
              </md-input-container> -->
            </md-list-expand>

          </md-list-item>
        </md-list>
      </md-list-expand>
    </md-list-item>
  </md-list>
</div>
</template>

<script>
export default {
  name: 'openapi',
  props: ['api'],
  computed: {
    tags: function() {
      var tags = {}
      var self = this
      Object.keys(self.api.paths).forEach(function(path) {
        Object.keys(self.api.paths[path]).forEach(function(method) {
          self.api.paths[path][method].tags.forEach(function(tag) {
            tags[tag] = tags[tag] || []
              // We should perhaps clone this object
            var entry = self.api.paths[path][method] //Vue.util.extend({}, self.api.paths[path][method]);
            entry.method = method
            entry.path = path
            tags[tag].push(entry)
          })
        })
      })
      return tags
    }
  }
}
</script>

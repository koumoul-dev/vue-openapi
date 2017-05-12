<template>
  <div></div>
</template>

<script>
import JSONFormatter from 'json-formatter-js'
global.JSONFormatter = JSONFormatter
import JSONSchemaView from 'json-schema-view-js/dist/bundle.js'
require('json-schema-view-js/dist/style.css')

export default {
  props: ['schema'],
  watch: {
    schema() {
      while (this.$el.firstChild) {
        this.$el.removeChild(this.$el.firstChild);
      }

      const view = new JSONSchemaView(this.schema, 2)
      this.$el.appendChild(view.render())
    }
  }
}
</script>

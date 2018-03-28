<template lang="html">
  <md-layout md-column class="response-display">
    <span>{{entry.method.toUpperCase()}} {{response.url}}&nbsp;&nbsp;&nbsp;&nbsp;<md-chip :class="response.ok ? 'md-primary':'md-warn'">{{response.status}} {{response.statusText}}</md-chip></span>
    <br>

    <md-list class="md-dense">
      <md-list-item>
        <md-subheader style="padding-left:0px;">Headers</md-subheader>
        <md-list-expand>
          <md-list>
            <md-list-item v-for="header in Object.keys(response.headers.map)">{{header}}: {{Array.isArray(response.headers.map[header]) ? response.headers.map[header].join(',') : response.headers.map[header]}}</md-list-item>
          </md-list>
        </md-list-expand>
      </md-list-item>
    </md-list>
    <md-subheader>Body</md-subheader>
    <pre>{{formattedBody}}</pre>
  </md-layout>
</template>

<script>
export default {
  props: ['response', 'entry'],
  computed: {
    formattedBody() {
      let res
      try {
        res = JSON.stringify(this.response.body, null, 2)
        if (typeof res === 'string') res = this.response.body
      } catch (err) {
        res = this.response.body
      }
      return res
    }
  }
}
</script>

<style lang="css">
.response-display pre {
  white-space: pre-wrap;
}
</style>

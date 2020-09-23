<template lang="html">
  <md-table>
    <md-table-header>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head>Location</md-table-head>
      </md-table-row>
    </md-table-header>

    <md-table-body>
      <md-table-row v-for="(security, i) in selectedEntry.security" :key="`security_${i}`">
        <md-table-cell>{{security.scheme.name}}</md-table-cell>
        <md-table-cell>{{security.scheme.type}}</md-table-cell>
        <md-table-cell>{{security.scheme.in}}</md-table-cell>
      </md-table-row>
    </md-table-body>
  </md-table>
</template>

<script>
export default {
  props: [ 'selectedEntry' ]
}
</script>

<style lang="css">
</style>

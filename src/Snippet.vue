<template lang="html">
  <div>
    <pre>
      <code>
{{ snippet }}
      </code>
    </pre>
  </div>
</template>

<script>
const HTTPSnippet = require('@koumoul/httpsnippet')

export default {
  props: ['request'],
  computed: {
    snippet() {
      const harRequest = {
        method: this.request.method.toUpperCase(),
        url: this.request.url,
        headers: Object.keys(this.request.headers).map(name => ({name, value: this.request.headers[name]})),
        queryString: Object.keys(this.request.params).map(name => ({name, value: this.request.params[name]}))
      }
      const contentType = this.request.headers['content-type']
      if (contentType) {
        if (contentType === 'multipart/form-data') {
          const params = []
          for (let entry of this.request.body.entries()) {
            if (entry[1] instanceof File) {
              params.push({name: entry[0], value: '@' + entry[1].name})
            } else {
              params.push({name: entry[0], value: entry[1]})
            }
          }
          harRequest.postData = {
            mimeType: contentType,
            params
          }
        } else {
          harRequest.postData = {
            mimeType: contentType,
            text: this.request.body
          }
        }
      }
      return new HTTPSnippet(harRequest).convert('shell', 'curl', {
        indent: '     '
      })
    }
  }
}
</script>

<style lang="css">
</style>

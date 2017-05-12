import Vue from 'vue'
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

exports.get = api => {
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

import _get from 'lodash.get'

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
      contentType.schema = _get(api, contentType.schema.$ref.split('#/').pop().replace(/\//g, '.'))
    } else if (contentType.schema.items && contentType.schema.items.$ref) {
      contentType.schema.items = _get(api, contentType.schema.items.$ref.split('#/').pop().replace(/\//g, '.'))
    }
    if (typeof contentType.schema !== 'string') {
      contentType.schemaHTML = '<pre>' + JSON.stringify(contentType.schema, null, 2) + '</pre>'
    }
  }
}

exports.get = api => {
  var tags = {}
  Object.keys(api.paths).forEach(function(path) {
    Object.keys(api.paths[path]).forEach(function(method) {
      let entry = api.paths[path][method]
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
        if (entry.requestBody.$ref) {
          entry.requestBody = _get(api, entry.requestBody.$ref.split('#/').pop().replace(/\//g, '.'))
        }
        if (entry.requestBody.content) {
          entry.requestBody.selectedType = Object.keys(entry.requestBody.content)[0]
          entry.requestBody.required = true
          Object.values(entry.requestBody.content).forEach(contentType => processContent(contentType, api))
        }
      }

      // Some preprocessing with responses
      Object.values(entry.responses).forEach(response => {
        if (response.content) {
          // preselecting responses mime-type
          response.selectedType = Object.keys(response.content)[0]
          Object.values(response.content).forEach(contentType => processContent(contentType, api))
        }
      })
    })
  })
  return tags
}

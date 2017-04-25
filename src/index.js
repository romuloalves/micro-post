'use strict'

const ALLOWED_HTTP_METHOD = 'POST'

const defaultResponse = 'Method Not Allowed'
const defaultContentType = 'text/plain'

function getDefaultParams(params) {
  if (params == null) {
    return {
      response: defaultResponse,
      contentType: defaultContentType
    }
  }

  if (params.response == null) {
    params.response = defaultResponse
  }
  if (params.contentType == null) {
    params.contentType = defaultContentType
  }

  return params
}

module.exports = exports = function (params, fn) {
  if (typeof params === 'function') {
    fn = params
    params = {}
  }
  params = getDefaultParams(params)

  return (req, res) => {
    res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD)
    const {method} = req
    if (method !== ALLOWED_HTTP_METHOD) {
      res.writeHead(405, {'Content-Type': params.contentType})
      const response = typeof params.response === 'object' ?
        JSON.stringify(params.response) :
        params.response
      res.end(response)
      return
    }
    return fn(req, res)
  }
}

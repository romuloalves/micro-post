'use strict'

const ALLOWED_HTTP_METHOD = 'POST'

const defaultErrorCode = 405
const defaultResponse = 'Method Not Allowed'
const defaultContentType = 'text/plain'

function getDefaultParams(params) {
  if (params == null) {
    return {
      errorCode: defaultErrorCode,
      response: defaultResponse,
      contentType: defaultContentType
    }
  }

  if (params.errorCode == null) {
    params.errorCode = defaultErrorCode
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
      const response = typeof params.response === 'object' ?
        JSON.stringify(params.response) :
        params.response
      res.writeHead(params.errorCode, {
        'Content-Type': params.contentType,
        'Content-Length': Buffer.byteLength(response)
      })
      res.end(response)
      return
    }
    return fn(req, res)
  }
}

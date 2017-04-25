'use strict'

const ALLOWED_HTTP_METHOD = 'POST'

module.exports = exports = function (params, fn) {
  if (!fn) {
    fn = params
  }
  return (req, res) => {
    res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD)
    const {method} = req
    if (method !== ALLOWED_HTTP_METHOD) {
      let {response} = params
      if (response === null || response === undefined) {
        response = 'Method Not Allowed'
      }
      if (typeof response === 'object') {
        response = JSON.stringify(response)
      }
      res.writeHead((params.errorCode || 405), {
        'Content-Type': (params.contentType || 'text/plain'),
        'Content-Length': Buffer.byteLength(response)
      })
      res.end(response)
      return
    }
    return fn(req, res)
  }
}

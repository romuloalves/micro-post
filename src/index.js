'use strict'

const ALLOWED_HTTP_METHOD = 'POST'

module.exports = exports = function (fn) {
  return (req, res) => {
    const {method} = req
    if (method !== ALLOWED_HTTP_METHOD) {
      res.writeHead(404)
      res.end('Not Found.')
      return
    }
    res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD)
    return fn(req, res)
  }
}

'use strict'

const ALLOWED_HTTP_METHOD = 'POST'

module.exports = exports = function (fn) {
  return (req, res) => {
    res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD)
    const {method} = req
    if (method !== ALLOWED_HTTP_METHOD) {
      res.writeHead(405)
      res.end('Method Not Allowed')
      return
    }
    return fn(req, res)
  }
}

const ALLOWED_HTTP_METHOD = 'POST'

module.exports = exports = function (params, fn) {
  if (!fn) {
    fn = params
  }

  // Get custom code and content or defaults
  const {errorCode = 405} = params

  // Get custom response of default
  let {response = 'Method Not Allowed', contentType = 'text/plain'} = params

  // Convert JSON responses to string
  if (typeof response === 'object') {
    response = JSON.stringify(response)
    contentType = 'application/json'
  }

  const contentLength = Buffer.byteLength(response.toString())

  return (req, res) => {
    res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD)
    const {method} = req
    if (method !== ALLOWED_HTTP_METHOD) {
      res.statusCode = errorCode
      if (typeof response === 'function') {
        // Execute custom response of function type
        return response(req, res, () => {
          res.end()
        })
      }

      res.setHeader('Content-Type', contentType)
      res.setHeader('Content-Length', contentLength)
      res.write(response)

      res.end()
      return
    }
    return fn(req, res)
  }
}

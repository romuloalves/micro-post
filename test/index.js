// Packages
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')

// Lib
const post = require('../src')

// Function service
const service = async function (req, res) {
  res.write('POST succeed')
  res.end()
}

test('succeed post', async t => {
  const microInstance = micro(post(service))
  const url = await listen(microInstance)
  const body = await request({
    method: 'POST',
    uri: url
  })

  t.deepEqual(body, 'POST succeed')
})

test('get with default message', async t => {
  const microInstance = micro(post(service))
  const url = await listen(microInstance)

  const error = await t.throws(request(url))
  t.deepEqual(error.statusCode, 405)
  t.deepEqual(error.error, 'Method Not Allowed')
  t.deepEqual(error.response.headers['content-type'], 'text/plain')
})

test('get with custom message', async t => {
  const microInstance = micro(post({response: 'Custom response'}, service))
  const url = await listen(microInstance)

  const error = await t.throws(request(url))
  t.deepEqual(error.statusCode, 405)
  t.deepEqual(error.error, 'Custom response')
  t.deepEqual(error.response.headers['content-type'], 'text/plain')
})

test('get with custom status code', async t => {
  const microInstance = micro(post({errorCode: 404}, service))
  const url = await listen(microInstance)

  const error = await t.throws(request(url))
  t.deepEqual(error.statusCode, 404)
  t.deepEqual(error.error, 'Method Not Allowed')
  t.deepEqual(error.response.headers['content-type'], 'text/plain')
})

test('get with custom status code and message', async t => {
  const microInstance = micro(post({errorCode: 404, response: 'My custom message!!'}, service))
  const url = await listen(microInstance)

  const error = await t.throws(request(url))
  t.deepEqual(error.statusCode, 404)
  t.deepEqual(error.error, 'My custom message!!')
  t.deepEqual(error.response.headers['content-type'], 'text/plain')
})

test('get with json response', async t => {
  const microInstance = micro(post({response: {error: true}}, service))
  const url = await listen(microInstance)

  const error = await t.throws(request(url))
  t.deepEqual(error.statusCode, 405)
  t.deepEqual(JSON.parse(error.error), {error: true})
  t.deepEqual(error.response.headers['content-type'], 'application/json')
})

test('get with function in the response', async t => {
  function responseFn(req, res, next) {
    res.write('writing...')
    next()
  }
  const microInstance = micro(post({response: responseFn}, service))
  const url = await listen(microInstance)

  const error = await t.throws(request(url))
  t.deepEqual(error.statusCode, 405)
  t.deepEqual(error.error, 'writing...')
})

test('get with HTML in the response', async t => {
  const microInstance = micro(post({response: '<h1>I am</h1><h2>HTML!</h2>', contentType: 'text/html'}, service))
  const url = await listen(microInstance)

  const error = await t.throws(request(url))
  t.deepEqual(error.statusCode, 405)
  t.deepEqual(error.error, '<h1>I am</h1><h2>HTML!</h2>')
  t.deepEqual(error.response.headers['content-type'], 'text/html')
})

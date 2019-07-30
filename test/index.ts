// Packages
import { ServerResponse, IncomingMessage } from 'http'
import micro, { RequestHandler } from 'micro'
import test  from 'ava'
import listen from 'test-listen'
// import request from 'request'
import requestPromise from 'request-promise'

// Lib
const post = require('../src')

// Function service
const service: RequestHandler = async function (_: any, res: ServerResponse) {
  res.write('POST succeed')
  res.end()
}

test('succeed post', async t => {
  const microInstance = micro(post(service))
  const url = await listen(microInstance)
  const body = await requestPromise({
    method: 'POST',
    uri: url
  })

  t.deepEqual(body, 'POST succeed')
})

test('get with default message', async t => {
  const microInstance = micro(post(service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 405)

  // @ts-ignore
  t.deepEqual(response.error, 'Method Not Allowed')
  // @ts-ignore
  t.deepEqual(response.response.headers['content-type'], 'text/plain')

  microInstance.close()
})

test('get with custom message', async t => {
  const microInstance = micro(post({response: 'Custom response'}, service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 405)

  // @ts-ignore
  t.deepEqual(response.error, 'Custom response')

  // @ts-ignore
  t.deepEqual(response.response.headers['content-type'], 'text/plain')

  microInstance.close()
})

test('get with custom status code', async t => {
  const microInstance = micro(post({errorCode: 404}, service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 404)

  // @ts-ignore
  t.deepEqual(response.error, 'Method Not Allowed')

  // @ts-ignore
  t.deepEqual(response.response.headers['content-type'], 'text/plain')

  microInstance.close()
})

test('get with custom status code and message', async t => {
  const microInstance = micro(post({errorCode: 404, response: 'My custom message!!'}, service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 404)

  // @ts-ignore
  t.deepEqual(response.error, 'My custom message!!')

  // @ts-ignore
  t.deepEqual(response.response.headers['content-type'], 'text/plain')

  microInstance.close()
})

test('get with json response', async t => {
  const microInstance = micro(post({response: {error: true}}, service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 405)

  // @ts-ignore
  t.deepEqual(JSON.parse(response.error as string), {error: true})

  // @ts-ignore
  t.deepEqual(response.response.headers['content-type'], 'application/json; charset=utf-8')

  microInstance.close()
})

test('get with function in the response', async t => {
  function responseFn(_req: any, res: ServerResponse, next: Function) {
    res.write('writing...')
    next()
  }

  const microInstance = micro(post({response: responseFn}, service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 405)

  // @ts-ignore
  t.deepEqual(response.error, 'writing...')

  microInstance.close()
})

test('get with micro RequestHandler in the response', async t => {
  function responseFn(_req: any, _res: ServerResponse) {
    return 'writing...'
  }

  const microInstance = micro(post({response: responseFn}, service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 405)

  // @ts-ignore
  t.deepEqual(response.error, 'writing...')

  microInstance.close()
})

test('get with HTML in the response', async t => {
  const microInstance = micro(post({response: '<h1>I am</h1><h2>HTML!</h2>', contentType: 'text/html'}, service))
  const url = await listen(microInstance)
  const response: IncomingMessage = await new Promise(async resolve => {
    let data = null

    try {
      data = await requestPromise(url, {
        resolveWithFullResponse: true
      })
    } catch (error) {
      data = error
    }

    return resolve(data)
  })

  t.deepEqual(response.statusCode, 405)

  // @ts-ignore
  t.deepEqual(response.error, '<h1>I am</h1><h2>HTML!</h2>')

  // @ts-ignore
  t.deepEqual(response.response.headers['content-type'], 'text/html')

  microInstance.close()
})

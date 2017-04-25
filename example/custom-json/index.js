'use strict'

const {send} = require('micro')
const post = require('../../src')

const responseErrorJson = {
  error: {
    message: 'Invalid method'
  }
}

module.exports = post({response: responseErrorJson, contentType: 'application/json'}, async (req, res) => {
  return send(res, 200, `It's a POST request!`)
})

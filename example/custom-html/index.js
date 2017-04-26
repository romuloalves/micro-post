'use strict'

const {send} = require('micro')
const post = require('../../src')

module.exports = post({response: '<h1>ERROR</h1><p>Not Allowed</p>', contentType: 'text/html'}, async (req, res) => {
  return send(res, 200, `It's a POST request!`)
})

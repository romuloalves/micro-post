'use strict'

const {send} = require('micro')
const post = require('../../src')

module.exports = post({response: 'Changing the default message is simple as breathe'}, async (req, res) => {
  return send(res, 200, `It's a POST request!`)
})

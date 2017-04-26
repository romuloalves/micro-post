'use strict'

const {send} = require('micro')
const post = require('../../src')

async function errorResponseFunction(req, res, next) {
  res.write('This was write by a custom response function')
  next()
}

module.exports = post({response: errorResponseFunction}, async (req, res) => {
  return send(res, 200, `It's a POST request!`)
})

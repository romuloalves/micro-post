'use strict'

const {send} = require('micro')
const post = require('../../src')

module.exports = post(async (req, res) => {
  return send(res, 200, `It's a POST request!`)
})

const {send} = require('micro')
const post = require('micro-post')

const responseErrorJson = {
  error: {
    message: 'Invalid method'
  }
}

module.exports = post({response: responseErrorJson}, async (req, res) => {
  return send(res, 200, 'It\'s a POST request!')
})

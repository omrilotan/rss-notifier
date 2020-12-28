const axios = require('axios')

const headers = {}
if (process.env.npm_config_user_agent) {
  headers['User-Agent'] = process.env.npm_config_user_agent
}

/**
 * Send webhook payload
 * @param {string} url
 * @param {object} data
 * @returns {Promise}
 */
module.exports = (url, data) => axios({
  url,
  method: 'post',
  headers,
  data
})

const Parser = require('rss-parser')

const headers = {}
const options = { headers }
if (process.env.npm_config_user_agent) {
  headers['User-Agent'] = process.env.npm_config_user_agent
}
const parser = new Parser(options)

/**
 * Get feed data
 * @param {string} feed Absolute URL
 * @returns {data}
 */
module.exports = async (feed) => await parser.parseURL(feed)

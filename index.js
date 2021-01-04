const getFeed = require('./lib/getFeed')
const logFormat = require('./lib/logFormat')
const minutesToMs = require('./lib/minutesToMs')
const send = require('./lib/send')
const template = require('./lib/template')

/**
 * @param {string} webhook
 * @param {string} channel
 * @param {string} feed
 * @param {number} [interval=900] In minutes. Default: minutes
 * @param {object} [logger=console]
 */
module.exports = async function check ({
  webhook,
  channel,
  feed,
  interval = 15,
  logger = console,
  format
} = {}) {
  if (/^json$/i.test(format)) {
    const originalLogger = logger
    logger = new Proxy(
      {},
      {
        get: (logger, level) => message => originalLogger[level](logFormat(message))
      }
    )
  }

  if (!webhook || !feed) {
    logger.error(`Missing webhook or feed ${{ webhook, feed }}`)
    return
  }

  const lastCheck = new Date(Date.now() - minutesToMs(interval))
  const { feedUrl, title, lastBuildDate, items } = await getFeed(feed)

  if (new Date(lastBuildDate) < lastCheck) {
    logger.debug(`Nothing changed since ${new Date(lastCheck)} in ${feed}`)
    return
  }

  const entries = items.filter(
    ({ isoDate, pubDate }) => new Date(isoDate || pubDate) > lastCheck
  )

  if (!entries.length) {
    logger.debug(`There are no new entries since ${new Date(lastCheck)} in ${feed}`)
    return
  }

  logger.debug(`Found an update in ${feed} on ${new Date(lastCheck)}`)

  const output = template({
    channel,
    feed: {
      title,
      url: feedUrl
    },
    entries
  })

  send(webhook, output).catch(logger.error)
}

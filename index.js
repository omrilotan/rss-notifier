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
  format,
  emoji = ':rolled_up_newspaper:'
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
  const now = new Date()
  const { feedUrl, title, lastBuildDate, pubDate, items } = await getFeed(feed)
  const lastUpdate = new Date(lastBuildDate || pubDate)

  if (lastUpdate < lastCheck) {
    logger.debug(`Nothing changed since ${new Date(lastCheck)} in ${feed}`)
    return
  }

  const entries = items.filter(
    ({ isoDate, pubDate }) => {
      const date = new Date(isoDate || pubDate)
      if (date < lastCheck) {
        return false
      }
      if (date > now) {
        // Future event
        return false
      }
      return true
    }
  )

  if (!entries.length) {
    logger.debug(`There are no new entries since ${new Date(lastCheck)} in ${feed}`)
    return
  }

  logger.debug(`Found an update in ${feed} since ${new Date(lastCheck)}`)

  const output = template({
    channel,
    feed: {
      title,
      url: feedUrl
    },
    entries,
    emoji
  })

  send(webhook, output).catch(logger.error)
}

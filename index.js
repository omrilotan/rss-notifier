const getFeed = require('./lib/getFeed')
const logFormat = require('./lib/logFormat')
const minutesToMs = require('./lib/minutesToMs')
const send = require('./lib/send')
const template = require('./lib/template')

const [ABORT, SUCCESS] = ['abort', 'success']

/**
 * @param {string} webhook
 * @param {string} channel
 * @param {string} feed
 * @param {number} [interval=900] In minutes. Default: minutes
 * @param {object} [logger=console]
 * @returns {Promise<string>}
 */
module.exports = async function check ({
  webhook,
  channel,
  feed,
  interval = 15,
  logger = console,
  format,
  emoji = ':rolled_up_newspaper:',
  dryRun
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
    return ABORT
  }

  const lastCheck = new Date(Date.now() - minutesToMs(interval))
  const now = new Date()
  const { feedUrl, title, lastBuildDate, pubDate, items } = await getFeed(feed)
  const lastUpdate = new Date(lastBuildDate || pubDate)

  if (lastUpdate < lastCheck) {
    logger.verbose(`Nothing changed since ${new Date(lastCheck)} in ${feed}`)
    return ABORT
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
    logger.verbose(`There are no new entries since ${new Date(lastCheck)} in ${feed}`)
    return ABORT
  }

  logger.verbose(`Found an update in ${feed} since ${new Date(lastCheck)}`)

  const output = template({
    channel,
    feed: {
      title,
      url: feedUrl
    },
    entries,
    emoji
  })

  if (dryRun) {
    return Promise.resolve(JSON.stringify(output, null, 1))
  }

  return send(webhook, output).then(
    () => SUCCESS
  ).catch(
    logger.error
  )
}

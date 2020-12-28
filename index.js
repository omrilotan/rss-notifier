const getFeed = require('./lib/getFeed')
const template = require('./lib/template')
const send = require('./lib/send')

/**
 * @param {string} webhook
 * @param {string} channel
 * @param {string} feed
 * @param {number} [interval=54000] Default: Fifteen minutes
 * @param {object} [logger=console]
 */
module.exports = async function check ({
  webhook,
  channel,
  feed,
  interval = 60 * 60 * 15,
  logger = console
} = {}) {
  if (!webhook || !feed) {
    logger.error(`Missing webhook or feed ${{ webhook, feed }}`)
    return
  }

  const lastCheck = new Date(Date.now() - (interval * 1000))
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

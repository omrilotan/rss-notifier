const getFeed = require('./lib/getFeed')
const formatter = require('./lib/formatter')
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
  logFormat,
  emoji = ':rolled_up_newspaper:',
  dryRun
} = {}) {
  logger = formatter(logger, logFormat)

  try {
    if (!webhook || !feed) {
      logger.error(`Missing webhook or feed ${{ webhook, feed }}`)
      return ABORT
    }

    const lastCheck = new Date(Date.now() - minutesToMs(interval))
    const now = new Date()
    const { title, lastBuildDate, pubDate, items } = await getFeed(feed)
    const lastUpdate = new Date(lastBuildDate || pubDate)

    if (lastUpdate < lastCheck) {
      logger.verbose(`Feed did not update since ${new Date(lastCheck)} in ${feed}`)
      return ABORT
    }

    const entries = items.filter(
      ({ isoDate, pubDate }) => {
        const date = new Date(isoDate || pubDate)
        if (date < lastCheck) {
          // Too old
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
      username: title,
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
  } catch (error) {
    logger.error(
      error instanceof Error
        ? [error.message, error.stack, `feed: ${feed}`].join('\n')
        : `${error} feed: ${feed}`
    )
  }
}

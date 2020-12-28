const emoji = require('../emoji')

/**
 * Create a formatted webhook payload from feed data
 * @param {string} channel Slack channel
 * @param {object} feed Feed metadata
 * @param {object} entries Filtered entries data
 * @returns {object} Formatted webhook payload
 */
module.exports = ({
  channel,
  feed,
  entries
}) => (
  {
    username: feed.title,
    channel,
    icon_emoji: emoji(),
    blocks: entries.map(
      ({ title, link }, index, entries) => {
        const result = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: title
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Entry'
              },
              url: link
            }
          }
        ]

        if (index < entries.length - 1) {
          result.push({ type: 'divider' })
        }
        return result
      }
    ).flat()
  }
)

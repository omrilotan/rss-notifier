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
  entries,
  emoji
}) => (
  {
    username: feed.title,
    channel,
    icon_emoji: emoji,
    blocks: entries.map(
      ({ title, contentSnippet, link, pubDate }, index, entries) => {
        const result = [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: title,
              emoji: true
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: new Date(pubDate).toGMTString()
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

        contentSnippet && result.push({
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: contentSnippet
            }
          ]
        })

        if (index < entries.length - 1) {
          result.push({ type: 'divider' })
        }
        return result
      }
    ).flat()
  }
)

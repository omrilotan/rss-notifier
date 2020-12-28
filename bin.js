const parse = require('yargs-parser')
const levelheaded = require('levelheaded')
const notifier = require('.')

const [, , ...argv] = process.argv
const {
  logLevel = 'warn',
  interval,
  webhook,
  channel,
  feed,
  feeds
} = parse(argv)

const logger = levelheaded({ minimal: logLevel })
const trim = i => i.trim()

const list = (feed || feeds)?.split(',').map(trim)

list?.forEach(
  (feed) => notifier({
    webhook,
    channel,
    feed,
    interval,
    logger
  })
)

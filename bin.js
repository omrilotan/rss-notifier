const parse = require('yargs-parser')
const levelheaded = require('levelheaded')
const notifier = require('.')

const [, , ...argv] = process.argv
const {
  CHANNEL,
  FEEDS,
  INTERVAL,
  LOG_FROMAT = 'plain',
  LOG_LEVEL = 'warn',
  WEBHOOK
} = process.env

const {
  channel = CHANNEL,
  feed = FEEDS,
  feeds = FEEDS,
  interval = INTERVAL,
  logFormat = LOG_FROMAT,
  logLevel = LOG_LEVEL,
  webhook = WEBHOOK
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
    logger,
    logFormat
  })
)

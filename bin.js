const parse = require('yargs-parser')
const levelheaded = require('levelheaded')
const notifier = require('.')
const formatter = require('./lib/formatter')

const [, , ...argv] = process.argv
const {
  CHANNEL,
  FEEDS,
  INTERVAL,
  LOG_FROMAT = 'plain',
  LOG_LEVEL = 'warn',
  WEBHOOK,
  EMOJI
} = process.env

const {
  channel = CHANNEL,
  feed = FEEDS,
  feeds = FEEDS,
  interval = INTERVAL,
  logFormat = LOG_FROMAT,
  logLevel = LOG_LEVEL,
  webhook = WEBHOOK,
  emoji = EMOJI,
  dryRun
} = parse(argv)

const logger = levelheaded({ minimal: logLevel })
const _logger = formatter(logger, logFormat)
const trim = i => i.trim()

process.on(
  'unhandledRejection',
  (error) => _logger.error(
    error instanceof Error
      ? [error.message, error.stack].join('\n')
      : `${error}`
  )
)

process.on(
  'uncaughtException',
  (error, origin) => _logger.error(
    error instanceof Error
      ? [error.message, error.stack, origin].join('\n')
      : `${error} ${origin}`
  )
)

const list = (feed || feeds)?.split(',').map(trim)

Promise.all(
  list?.map(
    (feed) => notifier({
      webhook,
      channel,
      feed,
      interval,
      logger,
      logFormat,
      emoji,
      dryRun
    })
  )
).then(
  results => results.map(
    result => _logger.debug(result)
  )
)

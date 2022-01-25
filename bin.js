const { promises: { readFile } } = require('fs')
const parse = require('yargs-parser')
const levelheaded = require('levelheaded')
const { load } = require('js-yaml')
const notifier = require('.')
const formatter = require('./lib/formatter')

const [, , ...argv] = process.argv
const trim = i => i.trim()
async function readYaml (file) {
  const content = await readFile(file, 'utf8')
  return load(content)
}

start(argv)

async function start (argv) {
  const args = parse(argv)
  const options = {}
  const config = args.config || process.env.CONFIG

  const configData = config
    ? await readYaml(config)
    : {}

  // Priority: CLI > YAML > ENV
  options.logLevel = args.logLevel || configData.logLevel || process.env.LOG_LEVEL || 'warn'
  options.logFormat = args.logFormat || configData.logFormat || process.env.LOG_FORMAT || 'plain'
  options.interval = args.interval || configData.interval || process.env.INTERVAL
  options.webhook = args.webhook || configData.webhook || process.env.WEBHOOK
  options.channel = args.channel || configData.channel || process.env.CHANNEL
  options.emoji = args.emoji || configData.emoji || process.env.EMOJI
  options.dryRun = Boolean(args.dryRun ?? configData.dryRun ?? process.env.DRY_RUN)
  options.list = (() => {
    const feed = args.feed || args.feeds || configData.feed || configData.feeds || process.env.FEED || process.env.FEEDS
    if (Array.isArray(feed)) {
      return feed
    }
    if (typeof feed === 'string') {
      return feed.split(',').map(trim)
    }
    return []
  })()

  const logger = levelheaded({ minimal: options.logLevel })
  const _logger = formatter(logger, options.logFormat)

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

  Promise.all(
    options.list?.map(
      (feed) => notifier({ ...options, logger, feed })
    )
  ).then(
    results => results.map(
      result => _logger.debug(result)
    )
  ).catch(
    error => _logger.error(
      error instanceof Error
        ? [error.message, error.stack].join('\n')
        : `${error}`
    )
  )
}

const { promises: { readFile } } = require('fs')
const parse = require('yargs-parser')
const levelheaded = require('levelheaded')
const { load } = require('js-yaml')
const notifier = require('.')
const formatter = require('./lib/formatter')

const [, , ...argv] = process.argv
const trim = i => i.trim()
async function readYaml (file) {
  if (!file) {
    return {}
  }

  const content = await readFile(file, 'utf8')
  return load(content)
}

start(argv)

async function start (argv) {
  const args = parse(argv)
  const options = {}
  const config = args.config || process.env.CONFIG

  options.logLevel = args.logLevel || process.env.LOG_LEVEL || 'warn'
  options.logFormat = args.logFormat || process.env.LOG_FORMAT || 'plain'

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

  try {
    const configData = await readYaml(config)

    // Priority: CLI > YAML > ENV
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
  } catch (error) {
    _logger.error(error)
    process.exit(1)
  }

  if (!options.list) {
    _logger.error('No feed specified', {
      options: JSON.stringify(options)
    })
    process.exit(1)
  }

  Promise.all(
    options.list.map(
      (feed) => notifier({ ...options, logger, feed })
    )
  ).then(
    results => _logger.debug(`${options.list} feeds produced ${results.length} results: ${results.join(', ')}`
  ).catch(
    error => _logger.error(
      error instanceof Error
        ? [error.message, error.stack].join('\n')
        : `${error}`
    )
  )
}

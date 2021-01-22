const errobj = require('errobj')

/**
 * @param {any}
 * @returns {object}
 */
const format = message => {
  if (typeof message === 'string') {
    return { message }
  }
  if (message instanceof Error) {
    return errobj(message)
  }
  return message
}

/**
 * @param {any}
 * @returns {string} JSON
 */
const json = message => [
  format,
  JSON.stringify
].reduce(
  (accumulator, fn) => fn(accumulator),
  message
)

/**
 * @param {object} logger
 * @param {function} processor
 * @returns {object} logger
 */
function wrap (logger, processor) {
  const originalLogger = logger
  return new Proxy(
    {},
    {
      get: (logger, level) => message => originalLogger[level](processor(message))
    }
  )
}

/**
 * @param {object} logger
 * @param {string} [format]
 * @returns {object} logger
 */
module.exports = function (logger, logFormat) {
  if (/^json$/i.test(logFormat)) {
    return wrap(logger, json)
  }

  return logger
}

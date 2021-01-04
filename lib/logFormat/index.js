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
module.exports = message => JSON.stringify(format(message))
// [
//   format,
//   JSON.stringify
// ].reduce(
//   (accumulator, fn) => fn(accumulator),
//   message
// );

/**
 * Check if substring is included in string. Case insensitive.
 * @param {string} string
 * @param {string} substring
 * @returns
 */
module.exports = (string, substring) => string && substring && string.toLowerCase().includes(substring.toLowerCase())

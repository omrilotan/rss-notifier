const list = [
  ':space_invader:',
  ':no_mouth:',
  ':nerd_face:',
  ':neutral_face:',
  ':grimacing:'
]

/**
 * Grab a random emoji from this list ↑
 * @returns {string}
 */
module.exports = () => list[
  Math.floor(
    Math.random() * list.length
  )
]

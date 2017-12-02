module.exports = function ({ code, loc, frame, message }) {
  if (code === 'EMPTY_BUNDLE') return

  // print location if applicable
  if (loc) {
    console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
    if (frame) console.warn(frame)
  } else {
    console.warn(message)
  }
}

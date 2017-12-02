var notify = require('wsk').notify
var writeErrorToJs = require('../helpers/writeErrorToJs')
var cleanupOutPath = require('../helpers/cleanupOutPath')
var printErrorFrame = require('../helpers/printErrorFrame.js')

module.exports = function (event, fileConfig) {
  var filePath = cleanupOutPath(event, fileConfig)
  notify({
    message: 'Fatal error compiling JS...',
    value: filePath,
    display: 'error'
  })
  console.error(event.error.message)
  var msg = 'Unfortunately, Rollup failed on initial build and watch was not initiated. Please ctrl-c and run your build again.'
  printErrorFrame(event.error, function () {
    // If there's an error on initial build, the watch doesn't initiate
    // Hopefully this is fixed in the future
    // https://github.com/rollup/rollup/issues/1773
    notify({
      message: msg,
      display: 'warn'
    })
  })
  writeErrorToJs(event.error, filePath, msg)
}

var writeErrorToJs = require('../helpers/writeErrorToJs')
var cleanupOutPath = require('../helpers/cleanupOutPath')
var printErrorFrame = require('../helpers/printErrorFrame.js')
var notify = require('wsk').notify

module.exports = function (event, fileConfig) {
  var filePath = cleanupOutPath(event, fileConfig)
  notify({
    message: 'Fatal error compiling JS...',
    value: filePath,
    display: 'error'
  })
  console.error(event.error.message)
  printErrorFrame(event.error)
  writeErrorToJs(event.error, filePath)
}

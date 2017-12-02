'use strict'

/* --------------------------------------------
 *
 * Create a watcher for a given filePath
 *
 * --------------------------------------------
 */

var watch = require('rollup').watch
var constructOutPath = require('./helpers/constructOutPath')
var c = require('./config.js')({production: false})

module.exports = {onEvent}

var rollupEvents = require('./events/index')
var watchList = {}

function onEvent (eventType, filePath, opts) {
  var outPath = constructOutPath(filePath, c.CONFIG)
  var fileConfig = Object.assign({}, c.rollupInConfig, {output: c.rollupOutConfig}, {watch: c.rollupWatchConfig})
  fileConfig.input = filePath
  watchList[filePath] = {firstRun: true}
  fileConfig.output.file = outPath
  initWatcher(watch, fileConfig)
}

function initWatcher (watch, fileConfig) {
  var watcher = watch(fileConfig)

  watcher.on('event', function (event) {
    if (!rollupEvents[event.code]) {
      rollupEvents.other(event, fileConfig)
    } else if (event.code === 'BUNDLE_START' && watchList[fileConfig.input].firstRun === true) {
      rollupEvents.bundleInitial(event, fileConfig)
      watchList[fileConfig.input].firstRun = false
    } else {
      let evtHandler = rollupEvents[event.code] || rollupEvents['other']
      evtHandler(event, fileConfig)
    }
  })
}

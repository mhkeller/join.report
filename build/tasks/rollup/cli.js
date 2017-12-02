'use strict'

/* --------------------------------------------
 *
 * Bundle all of our top-level js files
 *
 * --------------------------------------------
 */
var fs = require('fs')
var chalk = require('chalk')
var rollup = require('rollup')
var glob = require('glob')

var gracefulUnlink = require('../../utils/gracefulUnlink.js')
var formatBytes = require('../../utils/format-bytes.js')
var clock = require('../../utils/clock')
var formatTime = require('../../utils/format-time.js')
var constructOutPath = require('./helpers/constructOutPath')
var writeErrorToJs = require('./helpers/writeErrorToJs.js')
var printErrorFrame = require('./helpers/printErrorFrame.js')
var notify = require('wsk').notify
var c = require('./config.js')({production: true})

var start = clock()

glob(c.CONFIG.filesToBundle, {
  ignore: c.CONFIG.ignored
}, function (err, files) {
  if (err) {
    notify({
      message: 'Error reading Rollup glob.',
      value: c.CONFIG.filesToBundle,
      display: 'error',
      error: err
    })
  } else {
    files.forEach(function (file) {
      var inConfig = Object.assign({}, c.rollupInConfig, {input: file})
      var outPath = constructOutPath(file, c.CONFIG)

      rollup.rollup(inConfig).then(function (bundle) {
        var outConfig = Object.assign({}, c.rollupOutConfig, {file: outPath})

        bundle.write(outConfig).then(function () {
          var outMap = outPath + '.map'
          gracefulUnlink(outMap, function (err) {
            if (err) {
              notify({
                message: 'Error removing file...',
                value: outMap,
                display: 'error',
                error: err
              })
            }
          })
          var stats = fs.statSync(outPath)
          var fileSizeInUnits = formatBytes(stats['size'])
          var duration = formatTime(clock(start))
          notify({
            message: 'Minified and compiled JS to',
            value: outPath + ' ' + chalk.reset('(' + fileSizeInUnits + ', ' + duration + ')'),
            display: 'compile'
          })
        })
          .catch(function (err) {
            notify({
              message: 'Error writing rollup bundle...',
              value: outPath,
              display: 'error',
              error: err
            })
          })
      }).catch(function (err) {
        notify({
          message: 'Error rolling up JS...',
          value: file,
          display: 'error'
        })
        console.error(err.message)
        printErrorFrame(err)
        writeErrorToJs(err, outPath)
      })
    })
  }
})

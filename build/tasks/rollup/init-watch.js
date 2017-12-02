'use strict'

/* --------------------------------------------
 *
 * Create a watcher on all of our top-level js files
 *
 * --------------------------------------------
 */

var notify = require('wsk').notify
var glob = require('glob')
var watchNew = require('./onEvent.js')

var c = require('./config.js')({production: false})

// var cache = fs.readFileSync(config.)

// This could be replaced with config exporting an array once this is closed https://github.com/rollup/rollupjs.org/issues/69
glob(c.CONFIG.filesToBundle, function (err, files) {
  if (err) {
    notify({
      message: 'Error reading Rollup glob.',
      value: c.CONFIG.filesToBundle,
      display: 'error',
      error: err
    })
  } else {
    files.forEach(function (filePath) {
      watchNew.onEvent('add', filePath)
    })
  }
})

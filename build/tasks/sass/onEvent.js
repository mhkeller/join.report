'use strict'

var fs = require('fs')
var path = require('path')
var io = require('indian-ocean')
// var mkdirp = require('mkdirp')
var sass = require('node-sass')
var notify = require('wsk').notify

module.exports = {onEvent: onEvent}

function onEvent (eventType, filePath, opts) {
  var CONFIG
  if (!opts || !opts.use) {
    CONFIG = require('./config.js')
    io.extend(CONFIG, opts)
  } else {
    CONFIG = opts
  }
  var outFileName = path.basename(filePath).replace(/\.scss$/, '.css')
  var outFilePath = path.join(CONFIG.outStem, outFileName)
  var scssOptions = {
    file: filePath,
    outputStyle: CONFIG.compress ? 'compressed' : 'nested',
    includePaths: CONFIG.includePaths,
    outFile: outFilePath,
    sourceMap: CONFIG.sourcemap,
    sourceMapContents: CONFIG.sourcemap,
    sourceMapEmbed: CONFIG.sourcemap
  }

  if (path.dirname(filePath) === 'src/css' && eventType === 'unlink') {
    // If we removed a top level SCSS file, remove its corresponding css and map files
    fs.unlinkSync(outFilePath)

    notify({
      message: 'Removed CSS file...',
      value: outFilePath,
      display: 'compile'
    })
  } else {
    sass.render(scssOptions, function (err, result) {
      if (err) {
        notify({
          message: 'Error compiling SCSS file...',
          value: filePath,
          display: 'error',
          error: err
        })
      } else {
        // No errors during the compilation, write this result on the disk
        fs.writeFile(outFilePath, result.css, function (err) {
          if (err) {
            notify({
              message: 'Error writing CSS file...',
              value: outFilePath,
              display: 'error',
              error: err
            })
          } else {
            notify({
              message: 'Compiled CSS file to',
              value: outFilePath,
              display: 'compile'
            })
          }
        })
      }
    })
  }
}

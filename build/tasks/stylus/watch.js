'use strict'

// Load our watcher module
var watcher = require('wsk').watcher
var path = require('path')
var getTopLevelFiles = require('./helpers/getTopLevelFiles')

var CONFIG = require('./config.js')

var watchGroup = [
  {
    serviceName: 'stylus',
    path: CONFIG.watchTopLevel,
    displayOptions: {
      hideChildDirs: true
    },
    events: [
      {
        type: 'change',
        taskFiles: 'build/tasks/stylus/onEvent.js',
        options: {
          sourcemap: true
        }
      },
      {
        type: 'add',
        taskFiles: 'build/tasks/stylus/onEvent.js',
        options: {
          sourcemap: true
        }
      },
      {
        type: 'unlink',
        taskFiles: 'build/tasks/stylus/onEvent-unlink.js',
        targetFiles: function (filePath) {
          // If we removed a top level file, remove its corresponding css and map files
          var outFileName = path.basename(filePath).replace(/\.styl$/, '.css')
          var outFilePath = path.join(CONFIG.outStem, outFileName)
          return [
            outFilePath,
            outFilePath + '.map'
          ]
        }
      }
    ]
  }, {
    serviceName: 'stylus module',
    path: CONFIG.watchModules,
    displayOptions: {
      hideChildDirs: true
    },
    events: [
      {
        type: 'change',
        taskFiles: 'build/tasks/stylus/onEvent.js',
        targetFiles: getTopLevelFiles,
        options: {
          sourcemap: true
        }
      },
      {
        type: 'add',
        taskFiles: 'build/tasks/stylus/onEvent.js',
        targetFiles: getTopLevelFiles,
        options: {
          sourcemap: true
        }
      },
      {
        type: 'unlink',
        taskFiles: 'build/tasks/stylus/onEvent.js',
        targetFiles: getTopLevelFiles,
        options: {
          sourcemap: true
        }
      }
    ]
  }
]

watcher.add(watchGroup)

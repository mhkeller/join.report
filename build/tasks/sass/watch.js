'use strict'

// Load our watcher module
var watcher = require('wsk').watcher

var config = require('./config')

var pathsToWatch = require('./config.js').watchPath

var watchGroup = [
  {
    serviceName: 'sass',
    path: pathsToWatch,
    displayOptions: {
      hideChildrenDirs: true
    },
    events: [
      {
        type: 'change',
        taskFiles: 'build/tasks/sass/onEvent.js',
        options: config.devOptions
      },
      {
        type: 'add',
        taskFiles: 'build/tasks/sass/onEvent.js',
        options: config.devOptions
      },
      {
        type: 'unlink',
        taskFiles: 'build/tasks/sass/onEvent.js'
      }
    ]
  }
]

watcher.add(watchGroup)

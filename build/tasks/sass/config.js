'use strict'

var path = require('path')
// var plugins = [];

module.exports = {
  filePath: 'src/css/*.scss', // Specify your SCSS files
  watchPath: 'src/css/**/*.scss', // Specify your SCSS files to watch
  outStem: 'public/css/', // Specify your out CSS out file directory
  // use: plugins.map(function (plugin) { return require(plugin).call() }).concat([autoprefixer]),
  includePaths: [path.resolve('./', 'src/css')], // Where to look for SCSS modules
  buildOptions: {
    compress: true,
    sourcemap: false
  },
  devOptions: {
    compress: true,
    sourcemap: true
  }
}

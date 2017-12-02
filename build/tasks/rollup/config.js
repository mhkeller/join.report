'use strict'

var babel = require('rollup-plugin-babel')
var nodeResolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')
var uglify = require('rollup-plugin-uglify')

var onwarn = require('./helpers/onwarn.js')

// Our JS setup config
var CONFIG = {
  filesToBundle: 'src/js/*.js',
  outDir: 'public/js/',
  outFileExt: '.pkgd.js',
  nameTemplate: '{{name}}'
}

var rollupWatchConfig = {
  chokidar: {
    ignoreInitial: true
  }
}

var rollupInConfig = {
  input: null,
  plugins: [commonjs(), nodeResolve(), babel({exclude: 'node_modules/**'})],
  acorn: {
    allowReserved: true
  },
  onwarn
}

var rollupOutConfig = {
  format: 'iife',
  exports: 'none',
  file: null
}

CONFIG.outFileTemplate = CONFIG.outDir + CONFIG.nameTemplate

module.exports = function (opts) {
  if (opts.production === true) {
    rollupInConfig.plugins.push(uglify())
  }
  rollupOutConfig.sourcemap = opts.production !== true
  return {CONFIG, rollupInConfig, rollupOutConfig, rollupWatchConfig}
}

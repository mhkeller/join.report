'use strict'

/* --------------------------------------------
 *
 * These functions are for any preprocessing of data values when they are converted into markup
 * The keys in `exports` are available for use in html partials within wsk template tags
 *
 * e.g. `<[= h.formatDate(pubDate) ]>` where `pubDate` is a key in `config.json`
 *
 * --------------------------------------------
 */

// var fs = require('fs');
var io = require('indian-ocean')
var _ = require('underscore')

var replaceStr = require('./utils/replace-str.js')

/* --------------------------------------------
 * For convenience, add indian ocean
 */
exports.io = io
exports._ = _

/* --------------------------------------------
 * Format hyperlinks from markdown format
 * Replace links in copy text formatted as `[text](url)` as anchor links classed `dvz-t-disable`
 *
 */
function formatLinks (str) {
  return str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (a, b, c) {
    return '<a href="' + c + '" target="_blank" rel="noopener">' + b + '</a>'
  })
}
exports.formatLinks = formatLinks

/* --------------------------------------------
 * Split up a multiline string, usually from an AML document
 */
exports.printGrafs = function printGrafs (str) {
  return str.split(/\n+/)
    .filter(d => d.trim())
    .map(d => `<p>${d}</p>`).join('')
}

/* --------------------------------------------
 * Transformations that all body copy should go through when used with `h.import`
 */
exports.prettyCopy = function (input) {
  // Add other transform functions to this list that you want to be applied to body copy
  // The order is important because of the string replacement happening, so be careful
  var taskFns = [formatLinks]

  taskFns.forEach(function (taskFn) {
    input = replaceStr(input, taskFn)
  })
  return input
}

/* --------------------------------------------
 *
 * Main.js
 *
 * --------------------------------------------
 */

import {selectAll} from 'd3-selection'

import readDroppedFile from './modules/readDroppedFile'
import bakeTable from './modules/bakeTable'

import dragStatusChange from './modules/dragStatusChange'
import titleSequence from './modules/titleSequence'

var statusEmpty = dragStatusChange('empty')
var statusOver = dragStatusChange('dragover')
var statusDrop = dragStatusChange('drop')
var statusTable = dragStatusChange('table')

selectAll('.upload-input')
  .on('change', function () {
    readDroppedFile.call(this, function (el, json) {
      statusTable.call(el)
      bakeTable(el, json)
    })
  })
  .on('dragover', statusOver)
  .on('dragleave', statusEmpty)
  .on('drop', statusDrop)

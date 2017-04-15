/* --------------------------------------------
 *
 * Main.js
 *
 * --------------------------------------------
 */

import {selectAll} from 'd3-selection'
import {dispatch as Dispatch} from 'd3-dispatch'

import readDroppedFile from './modules/readDroppedFile'
import bakeTable from './modules/bakeTable'

import dragStatusChange from './modules/dragStatusChange'
import titleSequence from './modules/titleSequence'

const statusEmpty = dragStatusChange('empty')
const statusOver = dragStatusChange('dragover')
const statusDrop = dragStatusChange('drop')
const statusTable = dragStatusChange('table')

var dispatch = Dispatch('join', 'change-title')

titleSequence(dispatch)

selectAll('.upload-input')
  .on('change', function () {
    readDroppedFile.call(this, function (el, json) {
      statusTable.call(el)
      bakeTable(el, json, dispatch)
    })
  })
  .on('dragover', statusOver)
  .on('dragleave', statusEmpty)
  .on('drop', statusDrop)

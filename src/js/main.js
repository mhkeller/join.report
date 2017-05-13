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
import join from './modules/join'
import * as datastore from './modules/datastore'

const statusEmpty = dragStatusChange('empty')
const statusOver = dragStatusChange('dragover')
const statusDrop = dragStatusChange('drop')
const statusTable = dragStatusChange('table')
import {default as parent} from './modules/utils/getParentByClass'

const dispatch = Dispatch('col-selected', 'join', 'change-title', 'get-keys')

titleSequence(dispatch)
join(dispatch)

selectAll('.upload-input')
  .on('change', function () {
    readDroppedFile.call(this, function (err, el, json) {
      if (err) {
        console.error(err)
      } else {
        datastore.add(parent(el, 'sbs-single').id, json)
        statusTable.call(el)
        bakeTable(el, json, dispatch)
      }
    })
  })
  .on('dragover', statusOver)
  .on('dragleave', statusEmpty)
  .on('drop', statusDrop)

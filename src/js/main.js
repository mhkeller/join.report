/* --------------------------------------------
 *
 * Main.js
 *
 * --------------------------------------------
 */

import {select, selectAll} from 'd3-selection'
import {dispatch as Dispatch} from 'd3-dispatch'

import readDroppedFile from './modules/readDroppedFile'
import bakeTable from './modules/bakeTable'

import sbsStatusChange from './modules/sbsStatusChange'
import titleSequence from './modules/titleSequence'
import join from './modules/join'
import * as datastore from './modules/datastore'
import didJoin from './modules/didJoin'
import setDirty from './modules/setDirty'
import gutterSwap from './modules/gutterSwap'

const statusUploadReady = sbsStatusChange('upload-ready')
const statusOver = sbsStatusChange('dragover')
const statusDrop = sbsStatusChange('drop')
const statusTable = sbsStatusChange('table')
import {default as parent} from './modules/utils/getParentByClass'

const dispatch = Dispatch(
  'col-selected',
  'join',
  'change-title',
  'get-keys',
  'did-join',
  'set-dirty'
)

setDirty(dispatch)
didJoin(dispatch)
titleSequence(dispatch)
join(dispatch)

selectAll('.upload-input')
  .on('change', function () {
    readDroppedFile.call(this, function (err, el, json) {
      if (err) {
        console.error(err)
      } else {
        datastore.add(parent(el, 'sbs-single').dataset.side, json)
        statusTable.call(el)
        bakeTable(el, json, dispatch)
      }
    })
  })
  .on('dragover', statusOver)
  .on('dragleave', statusUploadReady)
  .on('drop', statusDrop)

select('.gutter-swap').on('click', gutterSwap(datastore))

/* --------------------------------------------
 *
 * Main.js
 *
 * --------------------------------------------
 */

import {select, selectAll, event} from 'd3-selection'
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
import exampleData from './modules/exampleData'

const statusUploadReady = sbsStatusChange('upload-ready')
const statusOver = sbsStatusChange('dragover')
const statusDrop = sbsStatusChange('drop')
const statusTable = sbsStatusChange('table')

const dispatch = Dispatch(
  'col-selected',
  'join',
  'change-title',
  'get-keys',
  'did-join',
  'set-dirty',
  'did-bake-table'
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
        console.log(el)
        statusTable.call(el)
        bakeTable(el, json, dispatch)
        dispatch.call('change-title', null, 'did-bake-table')
      }
    })
  })
  .on('dragover', statusOver)
  .on('dragleave', statusUploadReady)
  .on('drop', statusDrop)

select('.gutter-swap')
  .on('click', gutterSwap(dispatch, datastore))

select('.rejoin-button-container .button[data-which="cancel"]')
  .on('click', function (d) {
    event.preventDefault()
    event.stopPropagation()
    dispatch.call('set-dirty', null, false)
  })

select('.rejoin-button-container .button[data-which="join"]')
  .on('click', function (d) {
    event.preventDefault()
    event.stopPropagation()
    dispatch.call('join', null, select(this))
  })

select('#load-example')
  .on('click', function (d) {
    selectAll('.sbs-single[data-status="upload-ready"')
      .each(function () {
        let el = select(this).select('.upload-input').node()
        let json = exampleData[this.dataset.side]
        statusTable.call(el)
        bakeTable(el, json, dispatch)
      })
    dispatch.call('change-title', null, 'did-bake-table')
  })

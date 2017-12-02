/* --------------------------------------------
 *
 * Main.js
 *
 * --------------------------------------------
 */

import {select, selectAll, event} from 'd3-selection'
import {dispatch as Dispatch} from 'd3-dispatch'

import readDroppedFile from './modules/readDroppedFile'
import readPastedFile from './modules/readPastedFile'
import bakeTable from './modules/bakeTable'

import sbsStatusChange from './modules/sbsStatusChange'
import titleSequence from './modules/titleSequence'
import join from './modules/join'
import * as datastore from './modules/datastore'
import didJoin from './modules/didJoin'
import setDirty from './modules/setDirty'
import gutterSwap from './modules/gutterSwap'
import exampleData from './modules/exampleData'

import {default as parent} from './modules/utils/getParentByClass'

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

selectAll('.input-option')
  .on('click', function () {
    var sbs = select(parent(this, 'sbs-single'))
      .attr('data-status', this.dataset.which + '-ready')
    sbs.selectAll('.input-option').attr('data-active', 'false')
    select(this).attr('data-active', 'true')
  })

var pasteContainers = selectAll('.paste-container')

pasteContainers
  .select('button')
  .on('click', function () {
    var pasteContainer = select(parent(this, 'paste-container'))

    var sel = pasteContainer
      .select('select').node()

    var delimiter = sel.options[sel.selectedIndex].value

    var pastedValue = pasteContainer
      .select('textarea').node().value

    readPastedFile.call(this, pastedValue, delimiter, initDatasetView)
  })

selectAll('.upload-input')
  .on('change', function () {
    readDroppedFile.call(this, initDatasetView)
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
    selectAll('.sbs-single[data-status="upload-ready"],.sbs-single[data-status="paste-ready"]')
      .each(function () {
        let el = select(this).select('.upload-input').node()
        let json = exampleData[this.dataset.side]
        statusTable.call(el)
        bakeTable(el, json, dispatch, 'example-' + this.dataset.side + '.csv')
      })
    dispatch.call('change-title', null, 'did-bake-table')
  })

function initDatasetView (err, el, json, fileName) {
  if (err) {
    console.error(err)
  } else {
    statusTable.call(el)
    bakeTable(el, json, dispatch, fileName)
    dispatch.call('change-title', null, 'did-bake-table')
  }
}

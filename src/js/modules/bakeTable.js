import {select, event} from 'd3-selection'
import {default as parent} from './utils/getParentByClass'

import downloadFormats from './downloadFormats'
import downloadData from './downloadData'
import sbsStatusChange from './sbsStatusChange'
import sortTableRows from './utils/sortTableRows'
import pairs from './utils/pairs'

let escKeys = {
  keyCodes: [27],
  keys: ['Escape']
}

let returnKeys = {
  keyCodes: [13],
  keys: ['Enter']
}

let disp

function endContentEditable (tbodySel, skipSave) {
  if (skipSave !== true) {
    let cell = tbodySel.select('td[contentEditable="true"]')
    if (cell.size() > 0) {
      let cellData = cell.datum()
      let cellHtml = cell.html()
      if (cellData[1] !== cellHtml) {
        let tableRow = select(parent(cell.node(), 'table-row'))
        let rowDatum = tableRow.datum()
        rowDatum[cellData[0]] = cell.html()
        tableRow.datum(rowDatum)
        if (select(parent(tbodySel.node(), 'sbs-single')).attr('data-side') !== 'result') {
          disp.call('set-dirty', null, true)
        }
      }
    }
  }
  tbodySel.selectAll('td').attr('contentEditable', null)
}

export default function bakeTable (el, json, dispatch) {
  disp = dispatch
  let sbsContainer = select(el.className.indexOf('sbs-single') > -1 ? el : parent(el, 'sbs-single'))
  let sbsId = sbsContainer.attr('id')

  let tableGroupTest = sbsContainer.select('.table-group')
  if (tableGroupTest.size() > 0) {
    tableGroupTest.remove()
  }

  select('.gutter-swap').classed('hidden', false)

  let tableGroup = sbsContainer.append('div')
    .classed('table-group', true)
    // .datum(json)

  let pickColumn = tableGroup.append('div')
    .classed('pick-column', true)
    .attr('data-col-selected', 'false')
    .html('pick a column to join on')

  let btnGroup = tableGroup.append('div')
    .classed('table-btn-group', true)

  btnGroup.append('div')
    .classed('table-btn', true)
    .attr('data-which', 'reset')
    .on('click', resetTable)

  let downloadFormatsContainer = btnGroup.append('div')
    .classed('table-btn', true)
    .attr('data-which', 'download')
    .append('div')
      .classed('download-formats', true)

  downloadFormatsContainer.selectAll('.download-format').data(downloadFormats).enter()
    .append('div')
    .classed('download-format', true)
    .html(d => d.name)
    .on('click', downloadData(tableGroup))

  let tableContainer = tableGroup.append('div')
    .classed('table-container', true)
    .on('click', function (d) {
      endContentEditable(select(this).select('tbody'))
    })

  if (Array.isArray(json) && json.length === 0) {
    let errorContainer = tableContainer.append('div')
      .classed('error-message', true)
      .html('Your data was empty.')

    errorContainer.append('div')
      .classed('reset', true)
      .html('Try again.')
      .on('click', resetTable)
  } else {
    let table = tableContainer.append('table')
    let thead = table.append('thead').classed('thead', true)
    let tbody = table.append('tbody').classed('tbody', true)

    let ths = thead.selectAll('th').data(Object.keys(json[0])).enter()
      .append('th')
      .html(d => d)
      .on('click', function (d) {
        event.stopPropagation()
        thead.select('th.sorted').classed('sorted', false)
        endContentEditable(tbody)
        let asc = !JSON.parse(this.dataset.asc || 'false')
        select(this).classed('sorted', true).attr('data-asc', asc)
        trs.sort(sortTableRows(trs.data(), d, asc))
      })

    var castOptions = ths.append('div')
      .classed('cast-options-wrapper', true)
      .html(' ')

    castOptions.append('div')
      .classed('cast-options-container', true).selectAll('.cast-option').data(['string', 'number']).enter()
      .append('div')
        .classed('cast-option', true)

    ths.append('input')
      .attr('type', 'radio')
      .attr('name', sbsId)
      .attr('value', d => d)
      .on('click', function (d, i) {
        event.stopPropagation()
        pickColumn.attr('data-col-selected', 'true')
        thead.selectAll('th').classed('active', (q) => q === d)
        tbody.selectAll('td').classed('active', (q) => q[0] === d)
        dispatch.call('col-selected', parent(this, 'sbs-group'))
        endContentEditable(tbody)
      })

    let trs = tbody.selectAll('tr').data(json).enter()
      .append('tr')
      .classed('table-row', true)

    trs.selectAll('td').data(d => pairs(d)).enter()
      .append('td')
      .html(d => d[1]) // TODO, allow for multi-dimensional json
      .on('click', function (d) {
        event.stopPropagation()
        endContentEditable(tbody)
        let el = select(this)
        let editable = JSON.parse(el.attr('contentEditable') || 'false')
        if (!editable) {
          el.attr('contentEditable', true)
          el.node().focus()
        }
      })
      .on('keypress', function (d) {
        if (escKeys.keyCodes.indexOf(event.keyCode) > -1 || escKeys.keys.indexOf(event.key) > -1) {
          let td = select(this)
          endContentEditable(tbody, true)
          let parentD = select(parent(this, 'table-row')).datum()
          td.html(parentD[d[0]])
        } else if (returnKeys.keyCodes.indexOf(event.keyCode) > -1 || returnKeys.keys.indexOf(event.key) > -1) {
          endContentEditable(tbody)
        }
      })

    // Deleting rows
    thead.append('th').text('')

    let deletes = trs.append('td')
      .classed('row-delete', true)

    let removeStr = '<span class="remove-row">&times;</span>&nbsp;&nbsp;&nbsp;&nbsp;'
    let removeTitle = 'Remove this row'
    let restoreStr = '<span class="restore-row">&#8634;</span>&nbsp;&nbsp;&nbsp;&nbsp;'
    let restoreTitle = 'Restore this row'

    deletes.append('a')
      .attr('href', '#')
      .on('click', function (d, i) {
        event.preventDefault()

        let tableRow = select(parent(this, 'table-row'))
        let isDeleted = tableRow.attr('data-deleted') === 'true'
        if (isDeleted) {
          select(this).html(removeStr).attr('title', removeTitle)
          tableRow.attr('data-deleted', 'false')
          delete d.___deleted___
        } else {
          tableRow.attr('data-deleted', 'true')
          select(this).html(restoreStr).attr('title', restoreTitle)
          d.___deleted___ = true
        }
        dispatch.call('set-dirty', null, true)

        return false
      })
      .attr('title', removeTitle)
      .html(removeStr)
  }

  function resetTable () {
    sbsStatusChange('upload-ready').call(el)
    tableGroup.remove()
  }
}

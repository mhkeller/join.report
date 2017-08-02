import {select, event} from 'd3-selection'
import {default as parent} from './utils/getParentByClass'

import downloadFormats from './downloadFormats'
import downloadData from './downloadData'
import sbsStatusChange from './sbsStatusChange'
import sortTableRows from './utils/sortTableRows'
import castFns from './utils/castFns'
import pairs from './utils/pairs'
import getType from './utils/getType'

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

export default function bakeTable (el, json, dispatch, fileName) {
  disp = dispatch
  let sbsContainer = select(el.className.indexOf('sbs-single') > -1 ? el : parent(el, 'sbs-single'))
  let sbsId = sbsContainer.attr('id')

  let tableGroupTest = sbsContainer.select('.table-group')
  if (tableGroupTest.size() > 0) {
    tableGroupTest.remove()
  }

  select('.gutter-swap').classed('hidden', false)

  sbsContainer.attr('data-filename', fileName)

  let tableGroup = sbsContainer.append('div')
    .classed('table-group', true)
    // .datum(json)

  let pickColumn = tableGroup.append('div')
    .classed('pick-column', true)
    .attr('data-col-selected', 'false')
    // .html('pick a column to join on')

  let btnGroup = tableGroup.append('div')
    .classed('table-btn-group', true)

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

  btnGroup.append('div')
    .classed('table-btn', true)
    .attr('data-which', 'reset')
    .on('click', resetTable)

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

    let ths = thead.selectAll('th').data(pairs(json[0])).enter()
      .append('th')
      .html(d => d[0])

    var castOptions = ths.append('div')
      .classed('cast-options-wrapper', true)
      .attr('data-type', d => getType(d[1]))
      .html(' ')

    var castSelect = castOptions.append('select')
      .on('change', function () {
        event.stopPropagation()
        var d = JSON.parse(this.value)
        let castedData = trs.data()
        castedData.forEach(q => {
          q[d.key] = castFns[d.type](q[d.key])
        })
        trs.data(castedData)

        select(parent(this, 'cast-options-wrapper'))
          .attr('data-type', d.type)

        trs.selectAll('td')
          .data(q => pairs(q))
          .attr('data-type', q => getType(q[1]))
          .html(q => q[1])
      })

    castSelect.selectAll('option')
      .data(d => ['string', 'number', 'date'].map(q => {
        return {key: d[0], type: q}
      })).enter()
        .append('option')
        .html(d => d.type)
        .property('value', d => JSON.stringify(d))

    // sortContainer
    ths.append('div')
      .classed('sort-container', true)
      .on('click', function (d) {
        event.stopPropagation()
        thead.select('.sort-container.sorted').classed('sorted', false)
        endContentEditable(tbody)
        let asc = !JSON.parse(this.dataset.asc || 'false')
        select(this).classed('sorted', true).attr('data-asc', asc)
        trs.sort(sortTableRows(trs.data(), d[0], asc))
      })

    ths.append('input')
      .attr('type', 'radio')
      .attr('name', sbsId)
      .attr('value', d => d[0])
      .on('click', function (d, i) {
        event.stopPropagation()
        // console.log(d)
        pickColumn.attr('data-col-selected', 'true')
        thead.selectAll('th').classed('active', (q) => q && q[0] === d[0])
        tbody.selectAll('td').classed('active', (q) => q && q[0] === d[0])
        dispatch.call('col-selected', parent(this, 'sbs-group'))
        endContentEditable(tbody)
      })

    let trs = tbody.selectAll('tr').data(json).enter()
      .append('tr')
      .classed('table-row', true)

    trs.selectAll('td').data(d => pairs(d)).enter()
      .append('td')
      .attr('data-type', d => getType(d[1]))
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
    disp.call('set-dirty', null, false)
    console.log(el)
    var which = select(parent(el, 'sbs-single')).select('.input-option[data-active="true"]').attr('data-which')
    sbsStatusChange(which + '-ready').call(el)
    tableGroup.remove()
  }
}

import {select, event} from 'd3-selection'
import {default as parent} from './getParentByClass'

import pairs from './pairs'
import dragStatusChange from './dragStatusChange'
import sortTableRows from './sortTableRows'

let escKeys = {
  keyCodes: [27, 13],
  keys: ['Escape', 'Enter']
}

export default function bakeTable (el, json) {
  var sbsContainer = select(parent(el, 'sbs-single'))
  var sbsId = sbsContainer.attr('id')
  let tableContainer = sbsContainer.append('div')
    .classed('table-container', true)
    .on('click', function (d) {
      select(this).selectAll('td').attr('contentEditable', null)
    })

  if (Array.isArray(json) && json.length === 0) {
    let errorContainer = tableContainer.append('div')
      .classed('error-message', true)
      .html('Your data was empty.')

    errorContainer.append('div')
      .classed('restart', true)
      .html('Try again.')
      .on('click', function () {
        dragStatusChange('empty').call(el)
        errorContainer.remove()
      })
  } else {
    let table = tableContainer.append('table')
    let thead = table.append('thead')
    let tbody = table.append('tbody')

    let ths = thead.selectAll('th').data(Object.keys(json[0])).enter()
      .append('th')
      .html(d => d)
      .on('click', function (d) {
        event.stopPropagation()
        thead.select('th.sorted').classed('sorted', false)
        let asc = !JSON.parse(this.dataset.asc || 'false')
        select(this).classed('sorted', true).attr('data-asc', asc)
        trs.sort(sortTableRows(trs.data(), d, asc))
      })

    ths.append('input')
      .attr('type', 'radio')
      .attr('name', sbsId)
      .on('click', function () {
        console.log('here')
        event.stopPropagation()
        trs.selectAll('td').attr('contentEditable', null)
      })

    let trs = tbody.selectAll('tr').data(json).enter()
      .append('tr')
      .classed('table-row', true)

    trs.selectAll('td').data(d => pairs(d)).enter()
      .append('td')
      .html(d => d[1])
      .on('click', function (d) {
        event.stopPropagation()
        trs.selectAll('td').attr('contentEditable', null)
        let el = select(this)
        let editable = JSON.parse(el.attr('contentEditable') || 'false')
        if (!editable) {
          el.attr('contentEditable', true)
          el.node().focus()
        }
      })
      .on('keypress', function (d) {
        if (escKeys.keyCodes.indexOf(event.keyCode) > -1 || escKeys.keys.indexOf(event.key) > -1) {
          let el = select(this)
          el.attr('contentEditable', false)
          let input = el.html()
          let parentD = select(parent(this, 'table-row')).datum()
          parentD[d[0]] = input
        }
      })

    // Deleting rows
    thead.append('th').text('')

    let deletes = trs.append('td')
      .classed('row-delete', true)

    deletes.append('a')
      .attr('href', '#')
      .on('click', function (d, i) {
        event.preventDefault()

        let tableRow = select(parent(this, 'table-row'))
        let isDeleted = tableRow.attr('data-deleted') === 'true'
        if (isDeleted) {
          select(this).html('<span>&times;</span>&nbsp;Remove').attr('title', 'Remove this row')
          tableRow.attr('data-deleted', 'false')
          delete d.___deleted___
        } else {
          tableRow.attr('data-deleted', 'true')
          select(this).html('<span>+</span>&nbsp;Restore').attr('title', 'Restore this row')
          d.___deleted___ = true
        }

        return false
      })
      .attr('title', 'Delete this feature')
      .html('<span>&times;</span>&nbsp;Remove')
  }
}

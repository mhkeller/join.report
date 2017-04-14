import {select, event} from 'd3-selection'
import {default as parent} from './getParentByClass'

import values from './values'
import dragStatusChange from './dragStatusChange'
import sortTableRows from './sortTableRows'

export default function bakeTable (el, json) {
  var tableContainer = select(parent(el, 'sbs-single')).append('div')
    .classed('table-container', true)

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

    thead.selectAll('th').data(Object.keys(json[0])).enter()
      .append('th')
      .html(d => d)
      .on('click', function (d) {
        thead.select('th.sorted').classed('sorted', false)
        var asc = !JSON.parse(this.dataset.asc || 'false')
        select(this).classed('sorted', true).attr('data-asc', asc)
        trs.sort(sortTableRows(trs.data(), this.innerHTML, asc))
      })

    let trs = tbody.selectAll('tr').data(json).enter()
      .append('tr')
      .classed('table-row', true)

    trs.selectAll('td').data(d => values(d)).enter()
      .append('td')
      .html(d => d)
      .on('click', function () {
        var el = select(this)
        var editable = JSON.parse(el.attr('contenteditable') || 'false')
        if (!editable) {
          el.attr('contentEditable', true)
          el.node().focus()
        }
      })
      .on('keypress', function () {
        if (event.keyCode === 13 || event.key === 'Enter') {
          select(this).attr('contentEditable', false)
        }
      })

    // For deletion
    thead.append('th').text('')

    var deletes = trs.append('td')
      .classed('row-delete', true)
      .on('click', function () {
        event.stopPropagation()
      })

    deletes.append('a')
      .attr('href', '#')
      .on('click', function (d, i) {
        event.stopPropagation()
        event.preventDefault()

        var tableRow = select(parent(this, 'table-row'))
        var isDeleted = tableRow.attr('data-deleted') === 'true'
        if (isDeleted) {
          select(this).html('<span>&times;</span>&nbsp;Remove').attr('title', 'Remove this row')
          tableRow.attr('data-deleted', 'false')
          delete d.___deleted___
        } else {
          tableRow.attr('data-deleted', 'true')
          select(this).html('<span>+</span>&nbsp;Restore').attr('title', 'Restore this row')
          d.___deleted___ = true
        }

        // updateDownloads('data')
        // scaleMap()
        // if (mapOptions.colorType == 'choropleth') recolor()

        return false
      })
      .attr('title', 'Delete this feature')
      .html('<span>&times;</span>&nbsp;Remove')
  }
}

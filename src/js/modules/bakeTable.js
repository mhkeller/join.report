import {select} from 'd3-selection'

import values from './values'
import dragStatusChange from './dragStatusChange'
import {default as parent} from './getParentByClass'

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
      })

    let trs = tbody.selectAll('tr').data(json).enter()
      .append('tr')
    trs.selectAll('td').data(d => values(d)).enter()
      .append('td')
      .html(d => d)
  }
}


import {select} from 'd3-selection'

import values from './values'
import dragStatusChange from './dragStatusChange'

export default function bakeTable (el, json) {
  var container = select(el.parentNode)

  if (Array.isArray(json) && json.length === 0) {
    let errorContainer = container.append('div')
      .classed('error-message', true)
      .html('Your data was empty.')

    errorContainer.append('div')
      .classed('restart', true)
      .html('Try again.')
      .on('click', function () {
        dragStatusChange('empty').call(el)
        container.html('')
      })
  } else {
    let table = container.append('table')
    let thead = table.append('thead')
    let tbody = table.append('tbody')

    thead.selectAll('th').data(Object.keys(json[0])).enter()
      .append('th')
      .html(d => d)

    let trs = tbody.selectAll('tr').data(json).enter()
      .append('tr')
    trs.selectAll('td').data(d => values(d)).enter()
      .append('td')
      .html(d => d)
  }
}


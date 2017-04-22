import {selectAll} from 'd3-selection'
import * as datastore from './datastore'
import {default as parent} from './getParentByClass'

export default function joinCheck () {
  var els = selectAll('.table-container input:checked')
  var twoChecked = els.size() === 2
  if (twoChecked) {
    els.nodes().forEach(el => {
      datastore.setKey(parent(el, 'sbs-single').id, el.value)
    })
  }
  return selectAll('.table-container input:checked').size() === 2
}

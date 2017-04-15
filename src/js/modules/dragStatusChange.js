import {select} from 'd3-selection'
import {default as parent} from './getParentByClass'

export default function dragStatusChange (status) {
  return function () {
    select(parent(this, 'sbs-single')).attr('data-status', status)
  }
}
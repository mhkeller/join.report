import {select} from 'd3-selection'
import {default as parent} from './utils/getParentByClass'

export default function sbsStatusChange (status) {
  return function () {
    select(this.className.indexOf('sbs-single') > -1 ? this : parent(this, 'sbs-single')).attr('data-status', status)
  }
}

import {select} from 'd3-selection'

export default function dragStatusChange (status) {
  return function () {
    console.log(this, this.parentNode, status)
    select(this.parentNode).attr('data-status', status)
  }
}

import {selectAll} from 'd3-selection'

export default function joinCheck () {
  return selectAll('.table-container input:checked').size() === 2
}

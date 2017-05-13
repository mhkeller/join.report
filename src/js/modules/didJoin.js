import {select} from 'd3-selection'
import sbsStatusChange from './sbsStatusChange'
import bakeTable from './bakeTable'

const statusResult = sbsStatusChange('result')

export default function didJoin (dispatch) {
  dispatch.on('did-join', showJoin)

  function showJoin (joinResult) {
    dispatch.call('change-title', {report: joinResult.report}, 'did-join')
    // const el = document.querySelector('')
    const el = select('.sbs-single[data-status="empty"]').node()
    statusResult.call(el)
    bakeTable(el, joinResult.data, dispatch)
  }
}

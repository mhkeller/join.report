import {select} from 'd3-selection'
import sbsStatusChange from './sbsStatusChange'
import bakeTable from './bakeTable'
import * as datastore from './datastore'

const statusResult = sbsStatusChange('result')

export default function didJoin (dispatch) {
  dispatch.on('did-join', showJoin)

  function showJoin (joinResult) {
    datastore.hasJoined(true)
    dispatch.call('change-title', {report: joinResult.report}, 'did-join')

    const el = select('.sbs-single[data-status="empty"]').node()
    statusResult.call(el)
    bakeTable(el, joinResult.data, dispatch)
  }
}

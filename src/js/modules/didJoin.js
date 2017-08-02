import {select, selectAll} from 'd3-selection'
import sbsStatusChange from './sbsStatusChange'
import bakeTable from './bakeTable'
import * as datastore from './datastore'
import {extname} from './utils/path'

const statusResult = sbsStatusChange('result')

export default function didJoin (dispatch) {
  dispatch.on('did-join', showJoin)

  function showJoin (joinResult) {
    datastore.hasJoined(true)
    dispatch.call('change-title', {report: joinResult.report}, 'did-join')

    const el = select('.sbs-single[data-side="result"]')
      .attr('data-dirty', null)
      .node()

    var existingSbsSingles = selectAll('.sbs-single[data-side="left"],.sbs-single[data-side="right"]')

    var combinedFileName = []
    existingSbsSingles.each(function () {
      var fileName = select(this).attr('data-filename')
      var ext = extname(fileName)
      combinedFileName.push(fileName.replace(new RegExp(ext + '$'), ''))
    })

    statusResult.call(el)
    bakeTable(el, joinResult.data, dispatch, combinedFileName.join('_'))

    existingSbsSingles
      .attr('data-has-joined', true)
  }
}

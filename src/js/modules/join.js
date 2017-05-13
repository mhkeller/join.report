import joiner from 'joiner'
import * as datastore from './datastore'

import joinCheck from './joinCheck'

export default function join (dispatch) {
  dispatch.on('col-selected', checkForJoin)
  dispatch.on('join', performJoin)

  function checkForJoin () {
    var readyToJoin = joinCheck()
    if (readyToJoin) {
      dispatch.call('get-keys')
      dispatch.call('change-title', window, 'ready')
    }
  }

  function performJoin () {
    var datasets = datastore.getAll()
    var leftData = datasets.filter(d => d.order === 0)[0]
    var rightData = datasets.filter(d => d.order === 1)[0]
    var joinedData = joiner({
      leftData: leftData.json,
      leftDataKey: leftData.joinKey,
      rightData: rightData.json,
      rightDataKey: rightData.joinKey
    })
    dispatch.call('did-join', null, joinedData)
  }
}

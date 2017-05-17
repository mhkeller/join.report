import joiner from 'joiner'
import * as datastore from './datastore'

import joinCheck from './joinCheck'

export default function join (dispatch) {
  dispatch.on('col-selected', checkForJoin)
  dispatch.on('join', performJoin)

  function checkForJoin () {
    let readyToJoin = joinCheck()
    if (readyToJoin) {
      dispatch.call('get-keys')
      dispatch.call('change-title', window, 'ready')
    }
  }

  function performJoin () {
    let datasets = datastore.getAll()
    let leftData = datasets.left
    let rightData = datasets.right
    let joinedData = joiner({
      leftData: leftData.json,
      leftDataKey: leftData.joinKey,
      rightData: rightData.json,
      rightDataKey: rightData.joinKey
    })
    dispatch.call('did-join', null, joinedData)
  }
}

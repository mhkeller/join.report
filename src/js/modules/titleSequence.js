import joinCheck from './joinCheck'

export default function titleSequence (dispatch) {
  dispatch.on('join.change-title', performJoin)

  function performJoin (stepInfo, dir) {
    joinCheck()
    console.log('here', this)
  }
}

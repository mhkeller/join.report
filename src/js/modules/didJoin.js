export default function didJoin (dispatch) {
  dispatch.on('did-join', showJoin)

  function showJoin (joinedData) {
    dispatch.call('change-title', {report: joinedData.report}, 'did-join')
  }
}

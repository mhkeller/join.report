import {select} from 'd3-selection'
import * as datastore from './datastore'

export default function setDirty (dispatch) {
  dispatch.on('set-dirty', setDirty)

  function setDirty (isDirty) {
    if (datastore.hasJoined() === true) {
      // Show that the result table is dirty
      select('.sbs-single[data-status="result"]').attr('data-dirty', isDirty)
    }
  }
}

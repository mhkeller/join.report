// import {select} from 'd3-selection'
// import sbsStatusChange from './sbsStatusChange'

// const statusResult = sbsStatusChange('result')

export default function dsDidChange (dispatch) {
  dispatch.on('ds-did-change', didChange)

  function didChange (el) {
    console.log('did change', el)
  }
}

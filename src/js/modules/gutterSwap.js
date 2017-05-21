import {select, selectAll} from 'd3-selection'

export default function gutterSwap (dispatch, datastore) {
  return function () {
    selectAll('.sbs-single[data-side="left"],.sbs-single[data-side="right"]')
      .each(function () {
        let el = select(this)
        let side = el.attr('data-side')
        el.attr('data-side', side === 'left' ? 'right' : 'left')
      })

    datastore.swap()
    dispatch.call('set-dirty', null, true)
  }
}

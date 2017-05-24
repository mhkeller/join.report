import {selectAll} from 'd3-selection'

let datastore = {left: {}, right: {}}

export function setKey (side, joinKey) {
  datastore[side].joinKey = joinKey
}

export function swap () {
  let left = datastore.left
  let right = datastore.right
  datastore.left = right
  datastore.right = left
}

export function getAll () {
  let sides = ['left', 'right']
  sides.forEach(side => {
    console.log('data', selectAll('.sbs-single[data-side="' + side + '"] .table-row').data())
    datastore[side].json = selectAll('.sbs-single[data-side="' + side + '"] .table-row')
      .data()
      .filter(row => row.___deleted___ !== true)
  })
  return datastore
}

export function hasJoined (__) {
  if (__ === undefined) {
    return datastore.hasJoined
  }
  datastore.hasJoined = __
}

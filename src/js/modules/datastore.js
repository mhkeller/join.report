import {select} from 'd3-selection'

let datastore = {left: {}, right: {}}

export function setKey (side, joinKey) {
  datastore[side].joinKey = joinKey
}

// export function add (side, json) {
//   datastore[side] = {json: json}
// }

export function swap () {
  let left = datastore.left
  let right = datastore.right
  datastore.left = right
  datastore.right = left
}

export function getAll () {
  let sides = ['left', 'right']
  sides.forEach(side => {
    datastore[side].json = select('.sbs-single[data-side="' + side + '"] .table-group').datum()
  })
  return datastore
}

export function hasJoined (__) {
  if (__ === undefined) {
    return datastore.hasJoined
  }
  datastore.hasJoined = __
}

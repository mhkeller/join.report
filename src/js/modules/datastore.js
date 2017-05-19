let datastore = {left: null, right: null}
// const slug = require('./utils/idSlug.json') // TODO, figure out how to load this
// const slug = 'dataset-'

export function setKey (side, joinKey) {
  datastore[side].joinKey = joinKey
}

export function add (side, json) {
  datastore[side] = {json: json}
}

export function swap () {
  let left = datastore.left
  let right = datastore.right
  datastore.left = right
  datastore.right = left
}

export function getAll () {
  return datastore
}

export function hasJoined (__) {
  if (__ === undefined) {
    return datastore.hasJoined
  }
  datastore.hasJoined = __
}

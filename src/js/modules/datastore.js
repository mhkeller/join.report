let datastore = {left: null, right: null}
// const slug = require('./utils/idSlug.json') // TODO, figure out how to load this
// const slug = 'dataset-'

export function setKey (side, joinKey) {
  datastore[side].joinKey = joinKey
}

export function add (side, json) {
  datastore[side] = {json: json}
}

export function getAll () {
  return datastore
}

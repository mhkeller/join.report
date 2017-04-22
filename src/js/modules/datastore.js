let datastore = []
const slug = 'dataset-'

function idToOrder (id) {
  return +id.replace(slug, '')
}

export function setKey (id, key) {
  var record = datastore.filter(d => d.order === idToOrder(id))[0]
  record.joinKey = key
}

export function add (id, json) {
  var obj = {
    order: idToOrder(id),
    json: json
  }
  datastore.push(obj)
}

export function getAll () {
  return datastore.sort((a, b) => {
    if (a.order < b.order) {
      return -1
    } else if (a.order > b.order) {
      return 1
    } else {
      return 0
    }
  })
}

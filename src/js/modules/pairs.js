export default function pairs (obj) {
  var keys = Object.keys(obj)
  var length = keys.length
  var pairs = Array(length)
  for (var i = 0; i < length; i++) {
    pairs[i] = [keys[i], obj[keys[i]]]
  }
  return pairs
}

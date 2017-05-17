export default function pairs (obj) {
  let keys = Object.keys(obj)
  let length = keys.length
  let pairs = Array(length)
  for (var i = 0; i < length; i++) {
    pairs[i] = [keys[i], obj[keys[i]]]
  }
  return pairs
}

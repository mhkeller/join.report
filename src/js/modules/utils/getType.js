export default function getType (obj) {
  return toString.call(obj).split(' ')[1].replace(']', '').toLowerCase()
}

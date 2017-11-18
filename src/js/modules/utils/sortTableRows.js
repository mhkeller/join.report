export default function sortTableRows (data, column, asc) {
  return function (a, b) {
    var numeric = true

    data.forEach(function (d, i) {
      if (numeric && Object.keys(d).indexOf(column) > -1 && typeof d[column] !== 'number') {
        numeric = false
      }
    })

    // Do numeric sort if all numbers, otherwise lexicographic
    if (numeric) {
      let s1
      let s2
      if (asc === true) {
        s1 = a[column]
        s2 = b[column]
      } else {
        s1 = b[column]
        s2 = a[column]
      }
      if (typeof s1 !== 'number') return 1
      if (typeof s2 !== 'number') return -1

      s1 = parseFloat(s1)
      s2 = parseFloat(s2)

      if (s1 < s2) return -1
      if (s2 < s1) return 1
      return 0
    } else {
      let s1
      let s2
      if (asc === false) {
        s1 = a[column]
        s2 = b[column]
      } else {
        s1 = b[column]
        s2 = a[column]
      }

      if (!s1) return 1
      if (!s2) return -1

      if (typeof s1 !== 'string') s1 = JSON.stringify(s1)
      if (typeof s2 !== 'string') s2 = JSON.stringify(s2)

      if (s1 < s2) return -1
      if (s2 < s1) return 1
      return 0
    }
  }
}

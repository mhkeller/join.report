const castFns = {
  string: d => d.toString(),
  number: d => +d,
  date: d => new Date(d)
}

export default castFns

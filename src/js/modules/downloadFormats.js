import * as io from 'indian-ocean/dist/indian-ocean.browser.es6.js'

const formats = [
  {
    name: 'csv',
    format: io.formatters.csv
  },
  {
    name: 'tsv',
    format: io.formatters.tsv
  },
  {
    name: 'psv',
    format: io.formatters.psv
  },
  {
    name: 'json',
    format: io.formatters.json
  },
  {
    name: 'geojson',
    format: io.formatters.geojson
  }
]

export default formats

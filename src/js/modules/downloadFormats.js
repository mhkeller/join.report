import {formatters} from 'indian-ocean/dist/indian-ocean.browser.es6.js'

const formats = [
  {
    name: 'csv',
    format: formatters.csv
  },
  {
    name: 'tsv',
    format: formatters.tsv
  },
  {
    name: 'psv',
    format: formatters.psv
  },
  {
    name: 'json',
    format: formatters.json
  },
  {
    name: 'geojson',
    format: formatters.geojson
  }
]

export default formats

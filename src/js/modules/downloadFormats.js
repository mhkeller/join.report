import {formatters} from 'indian-ocean/dist/indian-ocean.browser.es6.js'
// import dbf from './libs/dbf'

const formats = [
  // {
  //   name: 'dbf',
  //   format: function (json) {
  //     return dbf.structure(json).buffer
  //   }
  // },
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
  }
]

export default formats

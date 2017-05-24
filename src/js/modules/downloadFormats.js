import {formatters} from 'indian-ocean/dist/indian-ocean.browser.es6.js'
import dbf from './libs/dbf'
import buf from 'buffer/'

console.log(buf)

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
  },
  {
    name: 'dbf',
    format: function (json) {
      var buf = dbf.structure(json)
      // return buf.buffer
      return toBuffer(buf.buffer)
    }
  }
]

// function toBuffer (buf) {
//   return String.fromCharCode.apply(null, new Uint8Array(buf));
// }

// function toBuffer (ab) {
//   var string = new TextDecoder('utf-8').decode(ab);
//   return string
// }

function toBuffer (ab) {
  var buffer = new buf.Buffer(buf.Buffer.from(ab).byteLength)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]
  }
  return buffer
}

export default formats

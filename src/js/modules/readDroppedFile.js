/* globals FileReader */
import {discernFormat, discernParser} from 'indian-ocean/dist/indian-ocean.browser.es6.js'
import readSource from './utils/readSource'
import {openDbf} from 'shapefile'

export default function readDroppedFile (cb) {
  // Only read the first file, don't allow multiple
  var file = this.files[0]

  var format = discernFormat(file.name)
  var fileReader = new FileReader()
  // Dbf is our only special case, read everything else in as plain text
  var reader = format !== 'dbf' ? readFileUtf : readDbf
  reader.call(this, fileReader, file, cb)
}

// Courtesy @veltman
function readDbf (reader, file, cb) {
  reader.onload = (e) => {
    openDbf(e.target.result)
      .then(readSource)
      .then(results => cb(null, this, results)) // results = array of feature properties
      .catch(err => cb(err.stack))
  }

  reader.readAsArrayBuffer(file)
}

function readFileUtf (reader, file, cb) {
  var parser = discernParser(file.name)
  reader.onload = (e) => {
    var json = parser(e.target.result)
    cb(null, this, json)
  }

  reader.readAsBinaryString(file)
}

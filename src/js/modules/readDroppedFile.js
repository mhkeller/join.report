/* globals FileReader */
import * as io from 'indian-ocean/dist/indian-ocean.browser.es6.js'

export default function readDroppedFile (cb) {
  // Only read the first file, don't allow multiple
  var self = this
  var file = self.files[0]

  var parser = io.discernParser(file.name)
  var reader = new FileReader()

  reader.onload = function (e) {
    var json = parser(e.target.result)
    cb(self, json)
  }

  reader.readAsBinaryString(file)
}


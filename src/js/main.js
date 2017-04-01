/* globals FileReader */
/* --------------------------------------------
 *
 * Main.js
 *
 * --------------------------------------------
 */

var joiner = require('joiner')
var io = require('indian-ocean/dist/indian-ocean.js')
var d3 = require('d3')

d3.selectAll('.sbs-single').on('change', readDroppedFile(displayDataset))

function readDroppedFile (cb) {
  return function () {
    // Only read the first file, don't allow multiple
    var file = this.files[0]

    var parser = io.discernParser(file.name)
    var reader = new FileReader()

    reader.onload = function (e) {
      var json = parser(e.target.result)
      cb(json)
    }

    reader.readAsBinaryString(file)
  }
}

function displayDataset (json) {
  console.log(json)
}

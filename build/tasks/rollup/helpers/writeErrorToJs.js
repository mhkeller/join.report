var fs = require('fs')
var notify = require('wsk').notify

module.exports = function (error, outPath, msg) {
  var secondMsg = ''
  if (msg) {
    secondMsg = `console.log("${msg}");`
  }
  fs.writeFile(outPath, `console.error("${error}"); ${secondMsg}`, function (err) {
    if (err) {
      notify({
        message: 'Error writing file',
        value: outPath,
        display: 'error',
        error: err
      })
    }
  })
}

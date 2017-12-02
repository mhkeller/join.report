var fs = require('fs')
var notify = require('wsk').notify
var chalk = require('chalk')
var getCodeFrame = require('./getCodeFrame.js')

module.exports = function printErrorFrame ({ code, loc, id, message }, cb) {
  fs.readFile(id, 'utf-8', function (err, source) {
    if (err) {
      notify({
        message: 'Error reading file',
        value: id,
        error: err
      })
    } else {
      let frame = getCodeFrame(source, loc.line, loc.columns).split('\n').map(d => '\t' + d).join('\n')
      console.error('\n' + chalk.gray(frame))
    }
    if (cb) {
      cb()
    }
  })
}

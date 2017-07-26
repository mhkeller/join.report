import {discernParser} from 'indian-ocean/dist/indian-ocean.browser.es6.js'

export default function readDroppedFile (str, delimiter, cb) {
  try {
    let parser = discernParser(null, delimiter)
    let json = parser(str)
    cb(null, this, json)
  } catch (err) {
    cb(err)
  }
}

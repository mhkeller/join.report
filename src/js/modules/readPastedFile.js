import {discernParser} from 'indian-ocean/dist/indian-ocean.browser.es6.js'
import {default as parent} from './utils/getParentByClass'
import {select} from 'd3-selection'

export default function readPastedFile (str, delimiter, cb) {
  var side = select(parent(this, 'sbs-single')).attr('data-side')
  var fileName = side + '-data'

  try {
    let parser = discernParser(null, delimiter)
    let json = parser(str)
    cb(null, this, json, fileName)
  } catch (err) {
    cb(err)
  }
}

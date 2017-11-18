/* --------------------------------------------
 * Browser-implementations of some NodeJS path module functions, adapted from Rich Harris, https://github.com/rollup/rollup/blob/master/browser/path.js
 */

export function basename (path) {
  return path.split(/(\/|\\)/).pop()
}

export function extname (path) {
  const match = /\.[^.]+$/.exec(basename(path))
  if (!match) return ''
  return match[0]
}

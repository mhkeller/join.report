/* --------------------------------------------
 *
 * getParentByClass
 * Walk the parent elements of the first argument to test if it has the desired class.
 * If found, return the element, otherwise return null.
 *
 */

'use strict'

export default function getParentByClass (el, klass) {
  let test = false
  let element = el

  while (!test) {
    element = element.parentNode
    if (element === null || element.className === undefined) break
    test = element.className.indexOf(klass) !== -1
  }

  return test ? element : null
}

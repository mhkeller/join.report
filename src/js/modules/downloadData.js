/* globals Blob */
// import {default as parent} from './utils/getParentByClass'
// import {select} from 'd3-selection'

export default function downloadData (tableGroup) {
  return function (d) {
    let formattedData = d.format(tableGroup.selectAll('.table-row').data().filter(d => d.___deleted___ !== true))

    let uri
    if (d.name === 'dbf') {
      // courtesy @veltman
      let blob = new Blob([formattedData])
      uri = window.URL.createObjectURL(blob)
    } else if (d.name.indexOf('json') > -1) {
      uri = 'data:application/json;charset=utf-8,' + escape(formattedData)
    } else {
      uri = 'data:text/csv;charset=utf-8,' + escape(formattedData)
    }

    // console.log(tableGroup)

    var fileName = tableGroup.attr('data-filename')

    let downloadLink = document.createElement('a')
    downloadLink.href = uri
    downloadLink.download = fileName + '.' + d.name

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }
}

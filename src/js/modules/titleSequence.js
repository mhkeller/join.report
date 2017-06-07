import {select, event} from 'd3-selection'
import styleMatchStatus from './utils/styleMatchStatus'
import * as datastore from './datastore'
import downloadFormats from './downloadFormats'
import downloadData from './downloadData'

// import * as helpers from './helpers'

export default function titleSequence (dispatch) {
  dispatch.on('change-title', changeTitle)

  // Maybe optionally pass in a `this` for other options
  function changeTitle (stepName) {
    if (steps[stepName]) {
      steps[stepName].call(this)
    } else {
      console.error('No step info found for name:', stepName)
    }
  }

  const steps = {
    'ready': function () {
      if (datastore.hasJoined() !== true) {
        let inst = select('#instructions')

        let h2 = inst.select('h2')
          .html('Ready to join!')

        inst.selectAll('.inst-el,.join-button').remove()

        inst.append('a')
          .attr('class', 'button button-primary join-button')
          .attr('href', '#')
          .html('Go for it!')
          .on('click', function () {
            event.stopPropagation()
            event.preventDefault()
            h2.html('Processing...')
            dispatch.call('join', null, select(this))
          })
      }
    },
    'did-bake-table': function () {
      if (datastore.hasJoined() !== true) {
        let inst = select('#instructions')

        inst.select('h2')
          .html('Setup your data...')

        inst.selectAll('.inst-el').remove()

        inst.append('p')
          .classed('inst-el', true)
          .html('Select a column for each table that you want to join on. You can remove rows by clicking the `x` on the right. To undo, click the reverse arrow that appears.')

        inst.append('p')
          .classed('inst-el', true)
          .html('Click on a cell to edit its contents directly. Hit `return` or click anywhere else to save your changes. Press `esc` to revert back.')
      }
    },
    'did-join': function () {
      let inst = select('#instructions')
      inst.selectAll('.button').remove()
      inst.selectAll('.inst-el').remove()
      // Not sure why I need to remove this, the html update doesn't take effect
      inst.select('h2').remove()
      inst.append('h2')
        .html('Join finished!')

      inst.append('p')
        .classed('inst-el', true)
        .html('<span class="bold">Match status:</span> ' + styleMatchStatus(this.report.matchStatus))

      inst.append('p')
        .classed('inst-el', true)
        .attr('data-which', 'prose-summary')
        .html('<span class="bold">Summary:</span> ' + this.report.prose.summary)

      let downloadBtn = inst.append('div')
        .attr('class', 'button button-primary button-sm')
        .attr('id', 'download-result')
        .html('Download as...')
        .on('click', function (d) {
          let sel = select(this)
          var open = !JSON.parse(sel.attr('data-open'))
          sel.attr('data-open', open)
        })

      let downloadFormatsContainer = downloadBtn.append('div')
        .classed('download-formats', true)

      let sbsSingle = select('.sbs-single[data-side="result"]')

      downloadFormatsContainer.selectAll('.download-format').data(downloadFormats).enter()
        .append('div')
        .classed('download-format', true)
        .html(d => d.name)
        .on('click', downloadData(sbsSingle))

      inst.append('div').append('p')
        .classed('inst-el', true)
        .classed('expand', true)
        .attr('data-open', 'false')
        .on('click', function (d) {
          let sel = select(this)
          var open = !JSON.parse(sel.attr('data-open'))
          sel.attr('data-open', open)
          detail.classed('show', open)
        })

      var detail = inst.append('p')
        .classed('inst-el', true)
        .attr('data-which', 'prose-full')
        .html(this.report.prose.full
            .replace(/(A|B) not/g, a => '<span class="line-break"></span>' + a)
            .replace(/(Matches in A and B:|B not in A:|A not in B:)/g, a => '<span class="bold">' + a + '</span>')
            )
    }
  }
}

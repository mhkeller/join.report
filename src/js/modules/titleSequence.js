import {select, event} from 'd3-selection'
import styleMatchStatus from './utils/styleMatchStatus'

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
      const inst = select('#instructions')

      const h2 = inst.select('h2')
        .html('Ready to join!')

      inst.selectAll('.inst-el').remove()

      inst.append('a')
        .attr('class', 'button button-primary join-button inst-el')
        .attr('role', 'button')
        .attr('href', '#')
        .html('Go for it')
        .on('click', function () {
          event.stopPropagation()
          event.preventDefault()
          dispatch.call('join')
          select(this).classed('processing', true).html('Please hold...')
          h2.html('Processing...')
        })
    },
    'did-join': function () {
      const inst = select('#instructions')

      inst.select('h2')
        .html('Join successful!')

      inst.selectAll('.button').remove()

      inst.append('p')
        .classed('inst-el', true)
        .html('Match status: ' + styleMatchStatus(this.report.matchStatus))

      inst.append('p')
        .classed('inst-el', true)
        .classed('data-which', 'prose-summary')
        .html(this.report.prose.summary)

      inst.append('p')
        .classed('inst-el', true)
        .classed('data-which', 'prose-full')
        .html(this.report.prose.full)
    }
  }
}

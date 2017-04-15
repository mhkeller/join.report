import {select, event} from 'd3-selection'

export default function titleSequence (dispatch) {
  dispatch.on('change-title', changeTitle)

  // Maybe optionally pass in a `this` for other options
  function changeTitle (stepName) {
    if (steps[stepName]) {
      // let el = steps[stepName].call(this)
      steps[stepName].call(this)
      // slideIn(el)
    } else {
      console.error('No step info found for name:', stepName)
    }
  }

  const steps = {
    'ready': function () {
      let inst = select('#instructions')

      let h2 = inst.select('h2')
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
    }
  }
}

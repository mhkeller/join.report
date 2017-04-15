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

      inst.select('h2')
        .html('Ready to join!')

      inst.selectAll('p').remove()

      inst.append('a')
        .attr('class', 'button button-primary join-button')
        .attr('role', 'button')
        .attr('href', '#')
        .html('Go for it')
        .on('click', () => {
          event.stopPropagation()
          event.preventDefault()
          dispatch.call('join')
        })
    }
  }
}

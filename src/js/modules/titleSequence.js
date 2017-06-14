import {select, event} from 'd3-selection'
import styleMatchStatus from './utils/styleMatchStatus'
import joinStrategies from './utils/joinStrategies'
import * as datastore from './datastore'
import downloadFormats from './downloadFormats'
import downloadData from './downloadData'

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
        var joinStratsContainer = inst.append('div')
          .classed('join-strats-container', true)
          .classed('inst-el', true)

        var joinStrategy = joinStratsContainer.selectAll('.join-strategy').data(joinStrategies).enter()
          .append('div')
            .classed('join-strategy', true)
            .attr('data-disabled', d => d.disabled)

        joinStrategy.append('input')
          .attr('type', 'radio')
          .attr('id', d => 'join-strategy_' + d.which)
          .attr('name', 'join-strategy')
          .attr('value', d => d.which)
          .attr('disabled', d => d.disabled)
          .attr('checked', d => d.checked)
          .on('click', function () {
            select('.join-strategy-desc.active').classed('active', false)
            select('.join-strategy-desc[data-which="' + this.id + '"]').classed('active', true)
          })

        joinStrategy.append('label')
          .attr('for', d => 'join-strategy_' + d.which)
          .attr('name', 'join-strategy')
          .html(d => d.which.charAt(0).toUpperCase() + d.which.substr(1, d.which.length))

        var joinStrategyDescsContainer = inst.append('div')
          .classed('join-strategy-descs', true)
          .classed('inst-el', true)

        joinStrategyDescsContainer.selectAll('.join-strategy-desc').data(joinStrategies).enter()
          .append('p')
            .classed('join-strategy-desc', true)
            .classed('active', d => d.checked)
            .attr('data-which', d => 'join-strategy_' + d.which)
            .html(d => '<span class="bold">Description:</span> ' + d.desc)

        joinStratsContainer.append('div')
          .classed('coming-soon', true)
          .html('<a href="https://github.com/mhkeller/joiner/issues" target="_blank" rel="noopener">Contribute a join strategy</a>!')

        inst.append('a')
          .attr('class', 'button button-primary')
          .attr('id', 'join-button')
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
        .on('mouseover', function (d) {
          select(this).attr('data-open', true)
        })
        .on('mouseout', function (d) {
          select(this).attr('data-open', false)
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

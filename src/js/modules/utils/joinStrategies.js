const joinStrategies = [
  {
    which: 'left',
    desc: 'Your data on the left will have columns added to it from the data on the right for rows that match on the selected columns.',
    checked: true
  },
  {
    which: 'inner',
    desc: '',
    disabled: true
  },
  {
    which: 'outer',
    desc: '',
    disabled: true
  },
  {
    which: 'inner left',
    desc: '',
    disabled: true
  },
  {
    which: 'outer left',
    desc: '',
    disabled: true
  }
]

export default joinStrategies

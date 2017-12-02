const matchStyles = {
  perfect: () => 'Perfect join!  🎉',
  some: () => ' Some rows joined 👍',
  none: () => 'None 😢',
  'all-in-a': () => 'All in A  🎉 joined! Some in B did.',
  'all-in-b': () => 'All in B  🎉 joined! Some in A did.'
}

export default function styleMatchStatus (which) {
  return matchStyles[which]()
}

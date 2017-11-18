const matchStyles = {
  perfect: () => 'Perfect join!  🎉',
  some: () => ' Some rows joined 👍',
  none: () => 'None 😢'
}

export default function styleMatchStatus (which) {
  return matchStyles[which]()
}

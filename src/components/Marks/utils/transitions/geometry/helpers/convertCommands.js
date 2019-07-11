export function pointsToCommands (points) {
  let commands = []

  let type = 'M'
  let x = points[0][0]
  let y = points[0][1]

  commands.push({ type, x, y })

  for (let i = 1; i < points.length; i++) {
    type = 'L'
    x = points[i][0]
    y = points[i][1]

    commands.push({ type, x, y })
  }

  return commands
}

export function commandsToPoints (commands) {
  let points = []

  for (let i = 0; i < commands.length; i++) {
    let command = commands[i]

    points.push([command.x, command.y])
  }

  return points
}

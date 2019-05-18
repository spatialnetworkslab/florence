export default {
  count,
  sum,
  mean,
  median,
  mode,
  min,
  max
}

function count (column) {
  return column.length
}

function sum (column) {
  let total = 0
  for (let value of column) {
    total += value
  }

  return total
}

function mean (column) {
  return sum(column) / count(column)
}

function median (column) {
  let asc = column.sort((a, b) => a > b)
  let len = count(column)

  if (len % 2 === 1) {
    // Odd
    return asc[Math.floor(len / 2)]
  } else {
    // Even
    let lower = asc[(len / 2) - 1]
    let upper = asc[(len / 2)]
    return (lower + upper) / 2
  }
}

function mode (column) {
  let counts = {}

  for (let value of column) {
    if (counts.hasOwnProperty(value)) {
      counts[value]++
    } else {
      counts[value] = 1
    }
  }

  let winner
  let winningVal = 0

  for (let value in counts) {
    if (counts[value] > winningVal) {
      winningVal = counts[value]
      winner = value
    }
  }

  return winner
}

function min (column) {
  let winner = Infinity
  for (let value of column) {
    if (value < winner) { winner = value }
  }
  return winner
}

function max (column) {
  let winner = -Infinity
  for (let value of column) {
    if (value > winner) { winner = value }
  }
  return winner
}

import { bisector } from 'd3-array'

export default function getDataInYear (data, year) {
  const income = []
  const population = []
  const lifeExpectancy = []

  for (let i = 0; i < data.length; i++) {
    const d = data[i]

    income.push(getValueInYear(d.income, year))
    population.push(getValueInYear(d.population, year))
    lifeExpectancy.push(getValueInYear(d.lifeExpectancy, year))
  }

  return { income, population, lifeExpectancy }
}

function getValueInYear (values, year) {
  const i = bisectYear(values, year, 0, values.length - 1)
  const a = values[i]
  if (i > 0) {
    const b = values[i - 1]
    const t = (year - a[0]) / (b[0] - a[0])
    return a[1] * (1 - t) + b[1] * t
  }
  return a[1]
}

const bisectYear = bisector(([year]) => year).left

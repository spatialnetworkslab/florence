<script>
  // Adapted from https://observablehq.com/@mbostock/the-wealth-health-of-nations
  import { Graphic, PointLayer, XAxis, YAxis } from '@snlab/florence'
  import { json } from 'd3-fetch'
  import { scaleLog, scaleLinear, scaleSqrt, scaleOrdinal } from 'd3-scale'
  import { bisector } from 'd3-array'
  import { schemeCategory10 } from 'd3-scale-chromatic'

  const width = 960
  const height = 560
  const scaleX = scaleLog().domain([200, 1e5])
  const scaleY = scaleLinear().domain([14, 86])
  const scaleRadius = scaleSqrt().domain([0, 5e8]).range([0, width / 24])
  let scaleColor

  const bisectYear = bisector(([year]) => year).left

  function valueAt (values, year) {
    const i = bisectYear(values, year, 0, values.length - 1)
    const a = values[i]
    if (i > 0) {
      const b = values[i - 1]
      const t = (year - a[0]) / (b[0] - a[0])
      return a[1] * (1 - t) + b[1] * t
    }
    return a[1]
  }

  function dataAt (year) {
    income = []
    population = []
    lifeExpectancy = []

    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      income.push(valueAt(d.income, year))
      population.push(valueAt(d.population, year))
      lifeExpectancy.push(valueAt(d.lifeExpectancy, year))
    }
  }

  let currentYear = 1800

  let done = false
  let data
  let name
  let region

  let income
  let population
  let lifeExpectancy

  json('/data/gapminder.json').then(json => {
    data = json
    scaleColor = scaleOrdinal()
      .domain(data.map(d => d.region))
      .range(schemeCategory10)
      .unknown('black')

    name = data.map(d => d.name)
    region = data.map(d => d.region)

    dataAt(currentYear)
    done = true
  })

  setInterval(() => {
    if (done && currentYear < 2009) {
      currentYear = currentYear + 0.2
      dataAt(currentYear)
    }
  }, 33)
</script>

{#if done}
  <Graphic 
    {width}
    {height}
    {scaleX}
    {scaleY}
    flipY
    padding={30}
  >

    <PointLayer
      x={income}
      y={lifeExpectancy}
      radius={population.map(scaleRadius)}
      fill={region.map(scaleColor)}
    />

    <XAxis />
    <YAxis />

  </Graphic>

  <h1>Current year: {Math.round(currentYear)}</h1>
{/if}

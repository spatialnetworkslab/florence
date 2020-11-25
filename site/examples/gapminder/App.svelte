<script>
  import { json } from 'd3-fetch'
  import { scaleLog, scaleLinear, scaleSqrt, scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'
  import { Graphic, PointLayer, XAxis, YAxis } from '@snlab/florence'
  import getDataInYear from './getDataInYear.js'

  const width = 500
  const height = 500  
  const scaleRadius = scaleSqrt().domain([0, 5e8]).range([0, width / 24])

  let currentYear = 1800
  let data, scaleColor, region, dataInCurrentYear

  (async () => {
    data = await json('/data/gapminder.json')

    region = data.map(d => d.region)
    dataInCurrentYear = getDataInYear(data, currentYear)

    scaleColor = scaleOrdinal()
      .domain(region)
      .range(schemeCategory10)
      .unknown('black')
  })

  setInterval(() => {
    if (data && currentYear < 2009) {
      currentYear = currentYear + 0.2
      dataInCurrentYear = getDataInYear(data, currentYear)
    }
  }, 33)
</script>

{#if data}

  <Graphic 
    {width}
    {height}
    scaleX={scaleLog().domain([200, 1e5])}
    scaleY={scaleLinear().domain([14, 86])}
    flipY
    padding={30}
  >

    <PointLayer
      x={dataInCurrentYear.income}
      y={dataInCurrentYear.lifeExpectancy}
      radius={dataInCurrentYear.population.map(scaleRadius)}
      fill={region.map(scaleColor)}
    />

    <XAxis />
    <YAxis />

  </Graphic>

  <h1>Current year: {Math.round(currentYear)}</h1>

{/if}

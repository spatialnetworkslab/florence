<script>
  import { json } from 'd3-fetch'
  import { scaleLog, scaleLinear, scaleSqrt, scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'
  import { Graphic, PointLayer, XAxis, YAxis } from '@snlab/florence'
  import getDataInYear from './getDataInYear.js'

  const width = 400
  const height = 400  
  const scaleRadius = scaleSqrt().domain([0, 5e8]).range([0, width / 24])

  let currentYear = 1800
  let data, scaleColor, region, dataInCurrentYear, ready

  (async () => {
    data = await json('/data/gapminder.json')

    region = data.map(d => d.region)
    dataInCurrentYear = getDataInYear(data, currentYear)

    scaleColor = scaleOrdinal()
      .domain(region)
      .range(schemeCategory10)
      .unknown('black')

    ready = true
  })()

  setInterval(() => {
    if (ready && currentYear < 2009) {
      currentYear = currentYear + 0.2
      dataInCurrentYear = getDataInYear(data, currentYear)
    }
  }, 33)
</script>

{#if ready}

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

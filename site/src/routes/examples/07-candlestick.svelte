<!-- adapted from https://observablehq.com/@d3/candlestick-chart -->

<script context="module">
  import { csvParse  } from 'd3-dsv'
  import { timeParse } from 'd3-time-format'
  const parseDate = timeParse("%Y-%m-%d")

  export async function preload() {
    const response = await this.fetch('https://gist.githubusercontent.com/mbostock/696604b8395aa68d0e7dcd74abd21dbb/raw/55c17dab8461cde25ca8c735543fba839b0c940b/AAPL.csv')
    const text = await response.text()
    const data = csvParse(text, (d) => {
      const date = parseDate(d["Date"])
      return {
        date,
        high: +d["High"],
        low: +d["Low"],
        open: +d["Open"],
        close: +d["Close"],
      }
    }).slice(-120)

    return { data }
  }
</script>

<script>
  import { scaleLinear, scaleLog, scaleBand } from 'd3-scale'
  import { interpolateRound } from 'd3-interpolate'
  import { timeDay, timeMonday } from 'd3-time'
  import { timeFormat } from 'd3-time-format'
  import { Graphic, Section, Label, LineLayer, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  export let data
  const padding = { top: 20, bottom: 30, left: 40, right: 30 }
  const width = 800
  const height = 600

  // set up data container 
  const dataContainer = new DataContainer(data)

  const domainHigh = dataContainer.domain('high')
  const domainLow = dataContainer.domain('low')
  const domainDate = dataContainer.domain('date')

  // set scales
  const scaleX = scaleBand()
    .domain(timeDay
      .range(domainDate[0], +domainDate[1]+1)
      .filter(d => d.getDay() !== 0 && d.getDay() !== 6))
    .padding(0.2)
  const scaleY = scaleLog()
    .domain([domainLow[0], domainHigh[1]])
    .interpolate(interpolateRound)
  
  // configure axes
  const xTicks = timeMonday
    .every(1)
    .range(domainDate[0], domainDate[1])
  const scaleYAxis = scaleLinear()
    .domain([domainLow[0], domainHigh[1]])
    .range([height-padding.bottom, padding.top])

</script>

<Graphic
  {width}
  {height}
>

  <Label
    x={400}
    y={10}
    text={'Candlestick Chart'}
  />

  <Section
    {scaleX} 
		{scaleY}
    {padding}
    flipY
  >  

    <LineLayer
      x={dataContainer.map('date', d => [d, d])}
      y={dataContainer.rows().map(r => [r.low, r.high])}
      strokeWidth={1}
    />

    <LineLayer
      x={dataContainer.map('date', d => [d, d])}
      y={dataContainer.rows().map(r => [r.open, r.close])}
      strokeWidth={4}
      stroke={dataContainer.rows().map(r => r.open > r.close ? '#da344d'
        : r.close > r.open ? '#32936f'
        : '#32936f')}
    />

    <XAxis
      tickValues={xTicks}
      labelFormat={timeFormat("%-m/%-d")}
      baseLine={false}
    /> 

    <YAxis
      scale={scaleYAxis}
      baseLine={false}
    />

  </Section>

</Graphic>
<!-- adapted from https://observablehq.com/@d3/area-chart -->

<script context="module">  
  export async function preload() {
    const response = await this.fetch('https://gist.githubusercontent.com/mbostock/14613fb82f32f40119009c94f5a46d72/raw/d0d70ffb7b749714e4ba1dece761f6502b2bdea2/aapl.csv')
    const text = await response.text()
    return { text }
  }
</script>

<script>
  import { csvParse, autoType } from 'd3-dsv'
  import { scaleLinear, scaleUtc } from 'd3-scale'
  import { area } from 'd3-shape'
  import { Graphic, Section, Label, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  export let text

  const width = 900
  const height = 500
  const padding = {top: 20, right: 20, bottom: 30, left: 30}

  const data = csvParse(text, autoType).map(({date, close}) => ({date, value: close}))

  const dataContainer = new DataContainer(data)

  const dateDomain = dataContainer.domain('date')
  const valueDomain = dataContainer.domain('value')

  const scaleX = scaleUtc()
    .domain(dateDomain)
    .range([padding.left, width - padding.right])

  const scaleY = scaleLinear()
    .domain([0, valueDomain[1]]).nice()
    .range([height - padding.bottom, padding.top])

  const chartArea = area()
    .x(d => scaleX(d.date))
    .y0(scaleY(0))
    .y1(d => scaleY(d.value))

</script>

<Graphic
  {width}
  {height}
>

  <Label
    x={450}
    y={10}
    text={'Area Chart'}
  />

  <Section
    {padding}
  >  

    <path
      d={chartArea(data)}
      fill={'steelblue'}
    />

    <XAxis
      scale={scaleX}
      baseLine={false}
    /> 

    <YAxis
      scale={scaleY}
      baseLine={false}
    />

  </Section>

</Graphic>
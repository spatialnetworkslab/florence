<!-- adapted from https://observablehq.com/@d3/density-contours -->

<script context="module">  
  export async function preload() {
    const response = await this.fetch('https://gist.githubusercontent.com/mbostock/e3f4376d54e02d5d43ae32a7cf0e6aa9/raw/dcb23e8f6eefdbc4ada97d6eda22b2a4f256c263/faithful.tsv')
    const text = await response.text()
    return { text }
  }
</script>

<script>
  import { tsvParse } from 'd3-dsv'
  import { contourDensity } from 'd3-contour'
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Label, PointLayer, Polygon, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  export let text

  const width = 900
  const height = 600
  const padding = {top: 20, right: 30, bottom: 30, left: 40}

  const data = tsvParse(text, ({waiting: x, eruptions: y}) => ({x: +x, y: +y}))

  const dataContainer = new DataContainer(data)
  const domainX = dataContainer.domain('x')
  const domainY = dataContainer.domain('y')

  const scaleX = scaleLinear()
    .domain(domainX).nice()
    .rangeRound([padding.left, width - padding.right])
  const scaleY = scaleLinear()
    .domain(domainY).nice()
    .rangeRound([height - padding.bottom, padding.top])

  const contours = contourDensity()
    .x(d => scaleX(d.x))
    .y(d => scaleY(d.y))
    .size([width, height])
    .bandwidth(30)
    .thresholds(30)
  (data)

</script>

<Graphic
  {width}
  {height}
>

  <Label
    x={450}
    y={10}
    text={'Density Contours'}
  />

  <Section
    {padding}
  >  

    {#each contours as c, i}
      <Polygon
        geometry={c}
        stroke={'steelblue'}
        strokeWidth={i % 5 ? 0.25 : 1}
        fill={'none'}
      />
    {/each}

    <PointLayer
      x={dataContainer.map('x', x => scaleX(x))}
      y={dataContainer.map('y', y => scaleY(y))}
      radius={2}
    />

    <!-- no axis titles yet because I couldn't get the Y to align -->
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
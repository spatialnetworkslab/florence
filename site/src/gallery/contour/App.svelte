<!-- adapted from https://observablehq.com/@d3/density-contours -->

<script>
  import { tsv } from 'd3-fetch'
  import { contourDensity } from 'd3-contour'
  import { scaleLinear } from 'd3-scale'
  import { onMount } from 'svelte'
  import {
    Graphic,
    Section,
    Label,
    PointLayer,
    Polygon,
    XAxis,
    YAxis
  } from '@snlab/florence/src/index.js'
  import DataContainer from '@snlab/florence-datacontainer'

  let done = false
  let data

  const url =
    'https://gist.githubusercontent.com/mbostock/e3f4376d54e02d5d43ae32a7cf0e6aa9/raw/dcb23e8f6eefdbc4ada97d6eda22b2a4f256c263/faithful.tsv'
  onMount(() => {
    tsv(url, ({ waiting: x, eruptions: y }) => ({ x: +x, y: +y })).then(d => {
      data = d
      done = true
    })
  })
  
  const width = 900
  const height = 600
  const padding = { top: 20, right: 30, bottom: 30, left: 40 }

  let dataContainer
  let domainX, domainY
  let scaleX, scaleY
  let contours

  $: {
    if (done) {
      dataContainer = new DataContainer(data)

      domainX = dataContainer.domain('x')
      domainY = dataContainer.domain('y')

      scaleX = scaleLinear()
        .domain(domainX)
        .nice()
        .rangeRound([padding.left, width - padding.right])
      scaleY = scaleLinear()
        .domain(domainY)
        .nice()
        .rangeRound([height - padding.bottom, padding.top])

      contours = contourDensity()
        .x(d => scaleX(d.x))
        .y(d => scaleY(d.y))
        .size([width, height])
        .bandwidth(30)
        .thresholds(30)(data)
      console.log(contours)
    }
  }
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
    {#if done}
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

      <XAxis
        scale={scaleX}
        baseLine={false}
      /> 

      <YAxis
        scale={scaleY}
        baseLine={false}
      />
    {/if}

  </Section>
</Graphic>
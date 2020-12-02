<script>
  import { tsv } from 'd3-fetch'
  import { autoType } from 'd3-dsv'
  import { contourDensity } from 'd3-contour'
  import { scaleLinear } from 'd3-scale'
  import { format } from 'd3-format'
  import { Graphic, PolygonLayer, PointLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const width = 500
  const height = 500

  let dataContainer, scaleX, scaleY, contours, ready

  (async () => {
    const data = await tsv('/data/eruptions.tsv', autoType)
    dataContainer = new DataContainer(data)

    scaleX = scaleLinear()
      .domain(dataContainer.domain('waiting'))
      .nice()
      .range([0, width])
      
    scaleY = scaleLinear()
      .domain(dataContainer.domain('eruptions'))
      .nice()
      .range([height, 0])

    contours = contourDensity()
      .x(d => scaleX(d.waiting))
      .y(d => scaleY(d.eruptions))
      .size([width, height])
      .bandwidth(30)
      .thresholds(30)(data)

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    {width} {height}
    padding={{ top: 20, right: 30, bottom: 30, left: 40 }}
  >

    <PolygonLayer
      geometry={contours}
      stroke={'steelblue'}
      strokeWidth={({ index }) => index % 5 ? 0.25 : 1}
      fill={'none'}
    />

    <PointLayer
      x={dataContainer.map('waiting', scaleX)}
      y={dataContainer.map('eruptions', scaleY)}
      radius={2}
    />

    <XAxis scale={scaleX} baseLine={false} /> 
    <YAxis scale={scaleY} baseLine={false} labelFormat={format('.1f')} />

  </Graphic>

{/if}

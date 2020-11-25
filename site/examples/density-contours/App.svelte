<script>
  import { tsv } from 'd3-fetch'
  import { contourDensity } from 'd3-contour'
  import { format } from 'd3-format'
  import { Graphic, PointLayer, PolygonLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const width = 500
  const height = 500

  let dataContainer, contours

  (async () => {
    const data = await tsv('/data/eruptions.tsv')

    dataContainer = new DataContainer(data)
    contours = contourDensity()
      .size([width, height])
      .bandwidth(30)
      .thresholds(30)(data);
  })()
</script>

{#if dataContainer}

  <Graphic 
    {width}
    {height}
    padding={{ top: 20, right: 30, bottom: 30, left: 40 }}
    scaleX={dataContainer.domain('waiting')}
    scaleY={dataContainer.domain('eruptions')}
  >

    <PolygonLayer
      geometry={contours}
      stroke={'steelblue'}
      strokeWidth={({ index }) => index % 5 ? 0.25 : 1}
      fill={'none'}
    />

    <PointLayer
      x={dataContainer.column('waiting')}
      y={dataContainer.column('eruptions')}
      radius={2}
    />

  <XAxis baseLine={false} /> 
  <YAxis baseLine={false} labelFormat={format('.1f')} />

</Graphic>

{/if}

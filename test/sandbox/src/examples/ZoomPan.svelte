<script>
  import { scaleLinear } from 'd3-scale'
  import { 
    Graphic, Section, PolygonLayer, Rectangle,
    XAxis, YAxis,
    createPanHandler, createZoomHandler
  } from '../../../../src'

  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let blockReindexing = false

  const setZoomIdentity = zoomId => { zoomIdentity = zoomId }
  const setBlockReindexing = bool => { blockReindexing = bool }

  const pan = createPanHandler(zoomIdentity, {
    setZoomIdentity,
    setBlockReindexing,
    extentX: [-500, 500],
    extentY: [-500, 500]
      // dimension: 'x'
  })

  const zoom = createZoomHandler(zoomIdentity, {
    setZoomIdentity,
    minZoom: 0.2,
    maxZoom: 3,
    center: { x: 0, y: 0 }
    // dimension: 'x'
  })
</script>

<Graphic width={500} height={500}>

  <!-- <Rectangle fill="blue" opacity={0.3} /> -->

  <Section 
    x1={50} x2={450}
    y1={50} y2={450}
    padding={30}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    {zoomIdentity}
    {...pan.handlers}
    {...zoom.handlers}
    {blockReindexing}
  >

    <Rectangle fill="blue" opacity={0.3} />

    <PolygonLayer
      x={[
        [0, 1, 1, 0, 0],
        [1, 2, 2, 1, 1],
        [2, 3, 3, 2, 2]
      ]}
      y={[
        [0, 0, 1, 1, 0],
        [1, 1, 2, 2, 1],
        [2, 2, 3, 3, 2]
      ]}
      fill={[
        'red', 'green', 'yellow'
      ]}
    />

    <XAxis zoomIdentity={{ y: 0, ky: 1 }} />
    <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
  
  </Section>

</Graphic>
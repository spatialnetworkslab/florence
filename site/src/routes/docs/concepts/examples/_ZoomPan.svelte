<script>
  import { scaleLinear } from 'd3-scale'
  import {
    Graphic, Section, Rectangle, XAxis, YAxis,
    createPanHandler, createZoomHandler
  } from '@snlab/florence'

  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let blockReindexing = false

  const setZoomIdentity = zoomId => { zoomIdentity = zoomId }
  const setBlockReindexing = bool => { blockReindexing = bool }

  const pan = createPanHandler(zoomIdentity, {
    setZoomIdentity,
    setBlockReindexing,
    extentX: [-500, 500],
    extentY: [-500, 500]
  })

  const zoom = createZoomHandler(zoomIdentity, {
    setZoomIdentity,
    minZoom: 0.2,
    maxZoom: 3
  })
</script>

<Graphic width={500} height={500}>

  <Section 
    padding={25}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    {zoomIdentity}
    {...pan.handlers}
    {...zoom.handlers}
    {blockReindexing}
  >

    <Rectangle x1={0} x2={2} fill="blue" opacity={0.3} />
    <Rectangle x1={2} x2={4} fill="red" opacity={0.3} />

    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>
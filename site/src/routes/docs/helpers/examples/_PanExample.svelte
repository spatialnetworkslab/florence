<script>
  import { 
    Graphic, Section, Rectangle, XAxis, YAxis, createPanHandler
  } from '@snlab/florence'

  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let blockReindexing = false

  const setZoomIdentity = zoomId => { zoomIdentity = zoomId }
  const setBlockReindexing = bool => { blockReindexing = bool }

  const pan = createPanHandler(zoomIdentity, {
    setZoomIdentity,
    setBlockReindexing,
    extentX: [-100, 100],
    extentY: [-100, 100]
  })
</script>

<Graphic width={200} height={200} padding={20} {blockReindexing}>

  <Section
    scaleX={[0, 10]}
    scaleY={[0, 10]}
    {zoomIdentity}
    {...pan.handlers}
  >
  
    <Rectangle x1={2.5} x2={7.5} y1={2.5} y2={7.5} />

    <XAxis />
    <YAxis />

  </Section>

</Graphic>
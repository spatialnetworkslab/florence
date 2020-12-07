<script>
  import { 
    Graphic, Section, Rectangle, XAxis, YAxis, createZoomHandler
  } from '@snlab/florence'

  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  const setZoomIdentity = zoomId => { zoomIdentity = zoomId }

  const zoom = createZoomHandler(zoomIdentity, {
    setZoomIdentity,
    minZoom: 0.2,
    maxZoom: 3
  })
</script>

<Graphic width={200} height={200} padding={20}>

  <Section
    scaleX={[0, 10]}
    scaleY={[0, 10]}
    {zoomIdentity}
    {...zoom.handlers}
  >
  
    <Rectangle x1={2.5} x2={7.5} y1={2.5} y2={7.5} />

    <XAxis />
    <YAxis />

  </Section>

</Graphic>
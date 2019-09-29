<script>
  import { 
    Graphic, Section, PointLayer, XAxis, YAxis,
    createPanHandler, createZoomHandler
  } from '../../../../src/'
  import { scaleLinear } from 'd3-scale'
  import normalDistribution from '../helpers/normalDistribution'

  const x = normalDistribution(400)
  const y = normalDistribution(400)

  const scale = scaleLinear().domain([0.3, 0.8])

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
    minZoom: 1,
    maxZoom: 3,
    extentX: [-500, 500],
    extentY: [-500, 500],
    step: 1
  })
</script>

<Graphic width={500} height={500}>

  <Section
    scaleX={scale}
    scaleY={scale}
    padding={30}
    {zoomIdentity}
    {blockReindexing}
    {...pan.handlers}
    {...zoom.handlers}
  >

    <PointLayer 
      {x} {y} radius={3 * zoomIdentity.kx}
      fill="steelblue"
      opacity={0.6}
    />

    <XAxis zoomIdentity={{ y: 0, ky: 1 }} />
    <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
  
  </Section>

</Graphic>
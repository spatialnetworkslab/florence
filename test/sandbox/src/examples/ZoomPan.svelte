<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, PolygonLayer, Rectangle, createPanHandler, createZoomHandler } from '../../../../src'

  let x = 0
  let y = 0
  let k = 1
  let zoomIdentity = { x, y, k }
  let step = 1

  const pan = createPanHandler(zoomIdentity, {
    extentX: [-500, 500],
    extentY: [-500, 500]
  })

  const zoom = createZoomHandler(zoomIdentity, {
    minZoom: 0.2,
    maxZoom: 3,
    extentX: [-500, 500],
    extentY: [-500, 500],
    step,
    center: { x: 0, y: 0 }
  })
</script>

x:
<input type="range" min={-300} max={300} bind:value={zoomIdentity.x} /> {zoomIdentity.x} <br />
y:
<input type="range" min={-300} max={300} bind:value={zoomIdentity.y} />  {zoomIdentity.y} <br />
k:
<input type="range" min={0} max={3} step={0.1} bind:value={zoomIdentity.k} /> {zoomIdentity.k} <br />

<div>
  <!-- Resets zoomId to pan origin { x: 0, y: 0, k: <present k value> } -->
  <button on:click={e => zoomIdentity = pan.reset() }> Reset pan </button>
  <!-- Resets zoomId to zoom origin { x: 0, y: 0, k: 1 } -->
  <button on:click={e => zoomIdentity = zoom.reset() }> Reset zoom </button>
  <!-- Brings viewport back to specified view point -->
  <button on:click={e => zoomIdentity = zoom.center() }> Center from Zoom </button>
</div>

<Graphic width={500} height={500}>

  <!-- <Rectangle fill="blue" opacity={0.3} /> -->

  <Section 
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    zoomIdentity={zoomIdentity}
    onWheel={ e => zoomIdentity = zoom(e) }
    onPan={ e => zoomIdentity = pan(e) }
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
  
  </Section>

</Graphic>
<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, PolygonLayer, Rectangle } from '../../../../'

  let x = 0
  let y = 0
  let k = 1

  let data = {
    x: [1, 2, 3, 1, 2, 3, 1, 2, 3],
    y: [1, 1, 1, 2, 2, 2, 3, 3, 3]
  }

  function handleZoom (id, event) {
    x = event.mouse.x
    y = event.mouse.y
    k += event.wheelDelta

    // x = event.pageX
    // y = event.pageY
    // let delta = 'wheelDelta', zoomFactor = 0.3, maxZoom = 2, minZoom = 1, scale = 1
    // let pos = {x:0, y:0}
    // let deltaVal = Math.max(-1, Math.min(1, event[delta]))
        
    // x1 = x1 - deltaVal * zoomFactor
    // x2 = x2 + deltaVal * zoomFactor
    // y1 = y1 - deltaVal * zoomFactor
    // y2 = y2 + deltaVal * zoomFactor
    // radius = radius - deltaVal * zoomFactor >= 0.5 ? radius - deltaVal * zoomFactor : 0.5
  }
</script>

x:
<input type="range" min={-300} max={300} bind:value={x} /> {x} <br />
y:
<input type="range" min={-300} max={300} bind:value={y} />  {y} <br />
k:
<input type="range" min={0} max={3} step={0.1} bind:value={k} /> {k} <br />

<Graphic width={500} height={500}>

  <!-- <Rectangle fill="blue" opacity={0.3} /> -->

  <Section 
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    zoomIdentity={{ x, y, k }}
    onWheel={ handleZoom }
  >

    <Rectangle fill="blue" opacity={0.3} />

    <!-- {#each data.x as _, i}

      <Rectangle
        x1={data.x[i] - 0.3} x2={data.x[i] + 0.3}
        y1={data.y[i] - 0.3} y2={data.y[i] + 0.3}
        fill={'red'}
      />

    {/each} -->
    
    <!-- <RectangleLayer
      x1={data.x.map(v => v - 0.3)} x2={data.x.map(v => v + 0.3)}
      y1={data.y.map(v => v - 0.3)} y2={data.y.map(v => v + 0.3)}
      fill="red"
    /> -->
    
    <!-- <Polygon
      x={[0, 3, 3, 0, 0]}
      y={[0, 0, 3, 3, 0]}
      fill="red"
    /> -->
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
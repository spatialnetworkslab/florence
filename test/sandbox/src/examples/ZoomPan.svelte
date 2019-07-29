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

  // handlePan and handleZoom should be placed in some sort of utility functions
  // How do we link util version handlePan/handleZoom to external svelte x, y, k?
  function handlePan (id, event) {
    // x -= event.delta.x
    // y -= event.delta.y
    // console.log(event, '222')
    let extentX = [-300, 300]
    let extentY = [-300, 300]

    let tempX = x - event.delta.x
    let tempY = y - event.delta.y

    if (tempX <= extentX[1] && tempX >= extentX[0]){
      x -= event.delta.x
    }
    
    if (tempY <= extentY[1] && tempY >= extentY[0]){
      y -= event.delta.y
    }
  }

  // active question - how to bound zoom
  // how to pinpoint zoom
  function handleZoom (id, event, step = 0.5, minZoom = 0, maxZoom = 3) {
    let tempK = k - event.wheelDelta * step
    if (tempK >= minZoom && tempK <= maxZoom){
      k -= event.wheelDelta * step
    }
    offsetX = -(event.coordinates.x * event.wheelDelta);
    offsetY = -(event.coordinates.y * event.WheelDelta);

    x += offsetX
    y += offsetY
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
    onPan ={ handlePan }
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
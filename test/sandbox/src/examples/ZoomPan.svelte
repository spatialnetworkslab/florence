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
    console.log(event. '222')
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

    // // k += Math.max(1, Math.min(maxZoom, event.wheelDelta)) * step // max zoom controls k value
    // const factor = 0.5
    // const max_scale = 4
    // const pos = { x: 0, y: 0 }
    // const zoom_target = { x: 0, y: 0 }
    // //console.log(event.originalEvent)
    // const zoom_point = { x: event.originalEvent.pageX - 50, 
    //                      y: event.originalEvent.pageY - 50 }
    // let scale = 1
    // // console.log(zoom_point)
    // // an experiment on getting the zoom to happen on a particular point
    // // let zoom_x = event.pageX, zoom_y = event.pageY
    // let size = {w: 400, h: 400}

    // // determine the point on where the slide is zoomed in
    // // let zoom_target = {}
    // zoom_target.x = (zoom_point.x - pos.x)/scale
    // zoom_target.y = (zoom_point.y - pos.y)/scale

    // // apply zoom
    // scale += event.wheelDelta * factor * scale
    // scale = Math.max(1,Math.min(max_scale,scale))

    // // calculate x and y based on zoom
    // pos.x = -zoom_target.x * scale + zoom_point.x
    // pos.y = -zoom_target.y * scale + zoom_point.y
    // //console.log(pos)

    // // Make sure the slide stays in its container area when zooming out
    // if(pos.x>0)
    //     pos.x = 0
    // if(pos.x+size.w*scale<size.w)
    //     pos.x = size.w*(scale-1)/2
    // if(pos.y>0)
    //     pos.y = 0
    //   if(pos.y+size.h*scale<size.h)
    //     pos.y = size.h*(scale-1)/2
    // console.log(pos)

    // x = pos.x + size.w*(scale-1)/2
    // y = pos.y + size.h*(scale-1)/2
    // x += event.wheelDelta
    // y += event.wheelDelta
    // console.log(x, y)
    // Make sure the slide stays in its container area when zooming out
    // if(pos.x>0){
    //   pos.x = 0
    // }
    // if(pos.x+size.w*scale<size.w) {
    //   pos.x = -size.w*(scale-1)
    // }

    // if(pos.y>0) {
    //   pos.y = 0
    // }
    // if(pos.y+size.h*scale<size.h) {
    //   pos.y = -size.h*(scale-1)
    // }

    // x1 = x1 - pos.x
    // x2 = x2 + pos.x
    // y1 = y1 - pos.y
    // y2 = y2 + pos.y


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
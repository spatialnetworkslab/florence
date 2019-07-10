<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Rectangle, Point } from '../sveg'

  let x1 = 0
  let x2 = 10
  let y1 = 0
  let y2 = 10
  let radius = 7

  $: domainX = [x1, x2]
  $: domainY = [y1, y2]

  let points = [
    [0, 0],
    [0, 5],
    [0, 10],
    [5, 10],
    [10, 10],
    [10, 5],
    [10, 0],
    [5, 0],
    [5, 5],

    [2.5, 2.5],
    [2.5, 7.5],
    [7.5, 7.5],
    [7.5, 2.5]
  ]

  const log = console.log

  function resetValues () {
    x1 = 0
    x2 = 10
    y1 = 0
    y2 = 10
    radius = 7
  }

  function handleZoom (id, event) {
    let delta = 'wheelDelta', zoomFactor = 0.3, maxZoom = 2, minZoom = 1, scale = 1
    let pos = {x:0, y:0}
    let deltaVal = Math.max(-1, Math.min(1, event[delta]))

    // an experiment on getting the zoom to happen on a particular point
    // let zoom_x = event.pageX, zoom_y = event.pageY
    // let size = {w: 300, h: 300}

    // determine the point on where the slide is zoomed in
    // let zoom_target = {}
    // zoom_target.x = (zoom_x - pos.x)/scale
    // zoom_target.y = (zoom_y - pos.y)/scale

    // apply zoom
    // scale += deltaVal * zoomFactor * scale
    // scale = Math.max(1, Math.min(maxZoom, scale))
    //console.log('+++', scale)

    // calculate x and y based on zoom
    // pos.x = -zoom_target.x * scale + zoom_x
    // pos.y = -zoom_target.y * scale + zoom_y

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
        
    x1 = x1 - deltaVal * zoomFactor
    x2 = x2 + deltaVal * zoomFactor
    y1 = y1 - deltaVal * zoomFactor
    y2 = y2 + deltaVal * zoomFactor
    radius = radius - deltaVal * zoomFactor >= 0.5 ? radius - deltaVal * zoomFactor : 0.5
  }
  
</script>

<div>

  domain x:

  <input type="number" bind:value={x1} />
  <input type="number" bind:value={x2} />

  <br />

  domain y:

  <input type="number" bind:value={y1} />
  <input type="number" bind:value={y2} />

</div>

<div>
  <button on:click={() => resetValues()}>Reset</button>
</div>

<Graphic width={500} height={500}>

  <Rectangle fill="green" />

  <Rectangle
    x1={100} x2={400}
    y1={100} y2={400}
    fill="orange" 
  />

  <Section
    x1={100} x2={400}
    y1={100} y2={400}
    scaleX={scaleLinear().domain(domainX)}
    scaleY={scaleLinear().domain(domainY)}
    onWheel={ handleZoom }
  >

    {#each points as point}
      <Point
        x={point[0]}
        y={point[1]}
        fill="white"
        radius={radius}
      />
    {/each}

  </Section>

</Graphic>
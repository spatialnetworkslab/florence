<script>
  import { Graphic, Section, Rectangle } from '../../../../src'
  import { scaleLinear } from 'd3-scale'

  let rectanglePosition = { x: 1, y: 1 }
  let rectangleWH = { w: 2, h: 2 }

  $: rectangleCoords = {
    x1: rectanglePosition.x, 
    y1: rectanglePosition.y, 
    x2: rectanglePosition.x + rectangleWH.w,
    y2: rectanglePosition.y + rectangleWH.h
  }

  let startDelta

  function handleStart (event) {
    // console.log(event)
    let localCoordinates = event.localCoordinates
    startDelta = { 
      x: localCoordinates.x - rectanglePosition.x,
      y: localCoordinates.y - rectanglePosition.y
    }
  }

  function handleDrag (event) {
    console.log(event)
    let localCoordinates = event.localCoordinates
    rectanglePosition = {
      x: localCoordinates.x - startDelta.x,
      y: localCoordinates.y - startDelta.y
    }
  }
</script>

<Graphic width={500} height={500}>

  <Section 
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
  >
  
    <Rectangle 
      {...rectangleCoords} 
      fill="green"
      onDragstart={handleStart}
      onDrag={handleDrag}
    />

  </Section>

</Graphic>
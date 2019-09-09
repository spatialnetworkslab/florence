<script>
  import { Graphic, Rectangle } from '../../../../src'
  import { scaleLinear } from 'd3-scale'

  let rectanglePosition = { x: 1, y: 1 }
  let rectangleWH = { w: 2, h: 2 }
  let dragOffset = { x: 0, y: 0 }

  $: rectangleCoords = {
    x1: rectanglePosition.x + dragOffset.x, 
    y1: rectanglePosition.y + dragOffset.y, 
    x2: rectanglePosition.x + dragOffset.x + rectangleWH.w,
    y2: rectanglePosition.y + dragOffset.y + rectangleWH.h
  }
</script>

<Graphic 
  width={500} height={500}
  scaleX={scaleLinear().domain([0, 10])}
  scaleY={scaleLinear().domain([0, 10])}
>

  <Rectangle 
    {...rectangleCoords} 
    fill="green"
    onDrag={event => { dragOffset = event.delta }}
  />

</Graphic>
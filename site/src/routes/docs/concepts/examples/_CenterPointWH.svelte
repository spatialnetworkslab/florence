<script>
  import { Graphic, Point, Rectangle } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  const point = { x: 5, y: 5 }

  let width = 200
  let height = 200
</script>

<div>
  <label for="width-slider">Width:</label><br />
  <input type="range" min="50" max="200" bind:value={width} name="height-slider" />
</div>

<div>
  <label for="height-slider">Height:</label><br />
  <input type="range" min="50" max="200" bind:value={height} name="height-slider" />
</div>

<Graphic
  {width}
  {height}
  scaleX={scaleLinear().domain([0, 10])}
  scaleY={scaleLinear().domain([0, 10])}
>
  <Rectangle fill="green" opacity={0.2} />

  <Point x={point.x} y={point.y} radius={10} fill="red" />

</Graphic>
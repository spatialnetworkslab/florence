<script>
  import { Graphic, Point } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  const point = { x: 5, y: 5 }
</script>

<Graphic
  width={200}
  height={200}
  scaleX={scaleLinear().domain([0, 10])}
  scaleY={scaleLinear().domain([0, 10])}
  backgroundColor="#b2ffb2"
>

  <Point x={point.x} y={point.y} radius={10} fill="red" />

</Graphic>
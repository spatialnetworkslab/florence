<script>
  import { Graphic, Point } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  const point = { x: 5, y: 5 }
</script>

<Graphic
  width={500}
  height={500}
  scaleX={scaleLinear().domain([0, 10])}
  scaleY={scaleLinear().domain([0, 10])}
>

  <Point x={point.x} y={point.y} radius={10} fill="red" />

</Graphic>
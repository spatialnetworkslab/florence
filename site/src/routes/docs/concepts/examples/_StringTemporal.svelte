<script>
  import { Graphic, Rectangle } from '@snlab/florence'
  import { scalePoint, scaleTime } from 'd3-scale'
</script>

<Graphic
  width={200}
  height={200}
  scaleX={scalePoint().domain(['a', 'b', 'c', 'd', 'e'])}
  scaleY={scaleTime().domain([new Date(2020, 1, 1), new Date(2020, 1, 10)])}
>

  <Rectangle
    x1="a" x2="e"
    y1={new Date(2020, 1, 1)} y2={new Date(2020, 1, 5)}
    fill="blue"
    opacity={0.5}
  />

  <Rectangle
    x1="b" x2="d"
    y1={new Date(2020, 1, 3)} y2={new Date(2020, 1, 10)}
    fill="red"
    opacity={0.5}
  />

</Graphic>
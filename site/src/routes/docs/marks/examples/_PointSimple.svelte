<script>
  import { Graphic, Point, PointLayer, XAxis, YAxis } from '@snlab/florence'
</script>

<Graphic width={200} height={200} scaleX={[0, 10]} scaleY={[0, 10]} padding={20}>

  <Point x={2.5} y={2.5} fill={'red'} />

  <PointLayer x={[5, 7.5]} y={[5, 7.5]} fill={'blue'} />

  <XAxis />
  <YAxis />

</Graphic>

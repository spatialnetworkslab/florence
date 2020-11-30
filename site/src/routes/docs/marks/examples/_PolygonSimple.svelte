<script>
  import { Graphic, Polygon, PolygonLayer, XAxis, YAxis } from '@snlab/florence'
</script>

<Graphic width={200} height={200} scaleX={[0, 10]} scaleY={[0, 10]} padding={20}>

  <Polygon
    x={[0, 2.5, 2.5, 0]}
    y={[0, 2.5, 0, 0]}
    fill={'red'}
  />

  <PolygonLayer 
    x={[[5, 7, 5, 3, 5], [10, 7.5, 7.5, 10]]} 
    y={[[7, 5, 3, 5, 7], [10, 7.5, 10, 10]]}
    fill={['blue', 'green']}
  />

  <XAxis />
  <YAxis />

</Graphic>
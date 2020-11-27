<script>
  import { Graphic, Line, LineLayer, XAxis, YAxis } from '@snlab/florence'
</script>

<Graphic width={200} height={200} scaleX={[0, 10]} scaleY={[0, 10]} padding={20}>

  <Line
    x={[0, 2.5, 2.5]}
    y={[0, 2.5, 0]}
    stroke={'red'}
  />

  <LineLayer 
    x={[[6, 4], [7.5, 10, 7.5]]} 
    y={[[6, 4], [7.5, 7.5, 10]]}
    stroke={['blue', 'green']}
  />

  <XAxis />
  <YAxis />

</Graphic>

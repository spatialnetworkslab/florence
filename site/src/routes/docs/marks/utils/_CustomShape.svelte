<script>
  import { Graphic, Symbol_, XAxis, YAxis } from '@snlab/florence'

  const septagon = {
    type: 'Polygon',
    coordinates: [[
      [-1, 0.29], [-0.8, -0.6], [0, -1], [0.8, -0.6], [1, 0.29],
      [0.45, 1], [-0.45, 1], [-1, 0.29], [-1, 0.29]
    ]]
  }
</script>

<Graphic width={200} height={200} scaleX={[0, 10]} scaleY={[0, 10]} padding={20}>

  <Symbol_ x={5} y={5} shape={septagon} size={50} />
  
  <XAxis />
  <YAxis />

</Graphic>

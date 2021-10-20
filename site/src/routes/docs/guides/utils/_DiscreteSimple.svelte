<script>
  import { Graphic, DiscreteLegend, Label } from '@snlab/florence'
</script>

<Graphic width={300} height={200} scaleX={[0, 300]} scaleY={[0, 200]}>

  <DiscreteLegend
    x1={50} x2={250}
    y1={25} y2={175}
    fill={['red', 'blue', 'green']}
    labels={['red', 'blue', 'green']}
  >

    <Label x={0.5} y={0.1} text="Discrete legend" />

  </DiscreteLegend>

</Graphic>

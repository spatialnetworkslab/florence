<script>
  import { Graphic, GradientLegend, Label } from '@snlab/florence'
</script>

<Graphic width={200} height={200}>

  <GradientLegend
    x1={50} x2={150}
    y1={25} y2={175}
    fill={['red', 'blue', 'green']}
    labels={['red', 'blue', 'green']}
  >

    <Label x={0.5} y={0.1} text="Gradient legend" />

  </GradientLegend>

</Graphic>

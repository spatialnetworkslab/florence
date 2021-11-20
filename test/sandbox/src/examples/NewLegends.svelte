<script>
  import { Graphic, DiscreteLegend, /* GradientLegend */ } from '../../../../src/'
</script>

<Graphic width={800} height={800} scaleX={[0, 800]} scaleY={[0, 800]}>

  <DiscreteLegend
    x1={100} x2={200}
    y1={100} y2={450}
    labels={['apple', 'banana', 'coconut']}
    fill={['green', 'yellow', 'brown']}
    opacity={[0.8, 1, 0.2]}
    backgroundColor={'#d3d3d3'}
  />

  <!-- <GradientLegend 
    x1={300} x2={400}
    y1={100} y2={450}
    labels={['apple', 'banana', 'coconut']}
    fill={['green', 'yellow', 'brown']}
    opacity={[0.8, 1, 0.2]}
  /> -->

</Graphic>
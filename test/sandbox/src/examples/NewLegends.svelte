<script>
  import { Graphic, Section, DiscreteLegend, GradientLegend } from '../../../../src/'
</script>

<Graphic width={800} height={800}>

  <DiscreteLegend
    x1={100} x2={200}
    y1={100} y2={450}
    labels={['apple', 'banana', 'coconut']}
    fill={['green', 'yellow', 'brown']}
    opacity={[0.8, 1, 0.2]}
  >

  </DiscreteLegend>

  <!-- <GradientLegend 
    x1={300} x2={400}
    y1={100} y2={450}
    labels={['apple', 'banana', 'coconut']}
    fill={['green', 'yellow', 'brown']}
    opacity={[0.8, 1, 0.2]}
  >

  </GradientLegend> -->

</Graphic>
<script>
  import { Graphic, Section, Title, DiscreteLegend, GradientLegend } from '../../../../src/'
</script>

<Graphic width={800} height={500}>

  <DiscreteLegend
    x1={100} x2={250}
    y1={300} y2={700}
    colors={['green', 'yellow', 'brown']}
    labels={['apple', 'banana', 'coconut']}
  >

    <Title title="Fruit colors" yOffset={-20} />

  </DiscreteLegend>

  <GradientLegend 
    x1={400} x2={550}
    y1={300} y2={700}
    colors={['green', 'yellow', 'brown']}
    labels={['apple', 'banana', 'coconut']}
  >
    <Title title="Fruit colors" yOffset={-20} />

  </GradientLegend>

</Graphic>
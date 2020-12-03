<script>
  import { Graphic, Section, Title, DiscreteLegend, GradientLegend } from '../../../../src/'
</script>

<Graphic width={800} height={800}>

  <DiscreteLegend
    x1={100} x2={200}
    y1={100} y2={250}
    colors={['green', 'yellow', 'brown']}
    labels={['apple', 'banana', 'coconut']}
  >

    <Title title="Fruit colors" yOffset={-20} />

  </DiscreteLegend>

  <GradientLegend 
    x1={300} x2={400}
    y1={100} y2={250}
    colors={['green', 'yellow', 'brown']}
    labels={['apple', 'banana', 'coconut']}
  >
    <Title title="Fruit colors" yOffset={-20} />

  </GradientLegend>

</Graphic>
<script>
  import { Graphic, Section, Title } from '../../../../src/'
  import DiscreteLegend from '../../../../src/components/Guides/__Legends/DiscreteLegend.svelte'
  import GradientLegend from '../../../../src/components/Guides/__Legends/GradientLegend.svelte'
</script>

<Graphic width={800} height={500}>

  <DiscreteLegend
    x1={300} x2={450}
    y1={300} y2={400}
    colors={['green', 'yellow', 'brown']}
    labels={['apple', 'banana', 'coconut']}
  >

    <Title title="Fruit colors" yOffset={-20} />

  </DiscreteLegend>

  <GradientLegend 
    x1={600} x2={700}
    y1={300} y2={400}
    colors={['green', 'yellow', 'brown']}
    labels={['apple', 'banana', 'coconut']}
  />

</Graphic>
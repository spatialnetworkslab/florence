<script>
  import { Graphic, Section } from '../../../../src/'
  import DiscreteColorLegend from '../../../../src/components/Guides/__Legends/DiscreteColorLegend.svelte'
</script>

<Graphic width={500} height={500}>

  <DiscreteColorLegend
    x1={300} x2={450}
    y1={300} y2={400}
    colors={['green', 'yellow', 'brown']}
    labels={['apple', 'banana', 'coconut']}
  />

</Graphic>
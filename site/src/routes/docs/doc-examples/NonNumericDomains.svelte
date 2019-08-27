<script>
  import { scaleBand, scaleLinear } from 'd3-scale'
  import { Graphic, Section, Rectangle, XAxis } from '../../../../../src'
</script>

<Graphic width={200} height={200} padding={10}>

  <Section
    scaleX={scaleBand().domain(['a', 'b', 'c'])}
    scaleY={scaleLinear().domain([0, 1])}
  >

    <Rectangle 
      x1={'a'} x2={'c'}
      y1={0} y2={0.5}
    />

    <!-- <XAxis /> -->
  
  </Section>

</Graphic>
<script>
  import { scalePoint, scaleLinear } from 'd3-scale'
  import { Graphic, Section, Rectangle, XAxis, YAxis } from '@snlab/florence'
</script>

<Graphic width={300} height={300}>

  <Section
    scaleX={scalePoint().domain(['a', 'b', 'c'])}
    scaleY={scaleLinear().domain([0, 1])}
    padding={30}
  >

    <Rectangle 
      x1={'a'} x2={'c'}
      y1={0} y2={0.5}
    />

    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>

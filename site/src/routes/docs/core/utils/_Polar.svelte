<script>
  import { scalePoint, scaleLinear } from 'd3-scale'
  import { Graphic, Section, Rectangle } from '@snlab/florence'
</script>

<Graphic width={500} height={500}>

  <Section
    scaleX={scalePoint().domain(['a', 'b', 'c'])}
    scaleY={scaleLinear().domain([0, 1])}
    transformation="polar"
  >

    <Rectangle x1={'a'} x2={'b'} y1={0} y2={0.75} fill="blue" />
    <Rectangle x1={'b'} x2={'c'} y1={0.75} y2={1} fill="red" />
  
  </Section>

</Graphic>
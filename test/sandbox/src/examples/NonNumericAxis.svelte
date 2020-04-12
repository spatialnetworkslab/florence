<script>
  import { scalePoint, scaleBand } from 'd3-scale'
  import { Graphic, Section, Rectangle, XAxis, YAxis } from '../../../../src/'
</script>

<Graphic width={500} height={500}>

  <Section
    padding={20}
    scaleX={scalePoint().domain(['a', 'b', 'c'])}
    scaleY={scalePoint().domain(['a', 'b', 'c'])}
  >
  
    <Rectangle x1={'a'} x2={'b'} y1={'a'} y2={'c'} fill="blue" opacity={0.5} />
    <Rectangle x1={'b'} x2={'c'} y1={'b'} y2={'c'} fill="red" opacity={0.5} />
    <Rectangle x1={'a'} x2={'c'} y1={'b'} y2={'a'} fill="green" opacity={0.5} />

    <XAxis />
    <YAxis scale={scaleBand().domain(['a', 'b', 'c'])} />

  </Section>

</Graphic>
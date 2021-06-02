<script>
  import { Graphic, Section, Rectangle, fitScales } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  const domains = {
    x: [2.5, 7.5],
    y: [0, 10]
  }

  const regularScales = {
    scaleX: scaleLinear().domain(domains.x),
    scaleY: scaleLinear().domain(domains.y)
  }
  
  const geoScales = fitScales(domains)
</script> 

<Graphic width={400} height={200}>

  <Section 
    x1={0} 
    x2={0.5}
    {...regularScales}
    padding={20}
    backgroundColor={'#d3d3d3'}
  >
    <Rectangle x1={2.5} x2={7.5} y1={0} y2={10} fill={'red'} />
  </Section>

  <Section 
    x1={0.5}
    x2={1}
    {...geoScales}
    padding={20}
    backgroundColor={'#d3d3d3'}
  >
    <Rectangle x1={2.5} x2={7.5} y1={0} y2={10} fill={'blue'} />
  </Section>

</Graphic>

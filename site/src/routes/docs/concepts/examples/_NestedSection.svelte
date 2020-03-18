<script>
  import { Graphic, Section, Point } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'
</script>

<Graphic
  width={500}
  height={500}
  padding={20}
  paddingColor="#b2ffb2"
>

  <Section 
    y1={0}
    y2={250}
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
  >

    <Point x={5} y={5} radius={10} fill="red" />

    <Section 
      x1={0}
      x2={5}
      y1={0}
      y2={5}
      scaleX={scaleLinear().domain([0, 10])}
      scaleY={scaleLinear().domain([0, 10])}
    >

      <Point x={5} y={5} radius={10} fill="orange" />
    
    </Section>
  
  </Section>

  <Section 
    y1={250}
    y2={500}
    scaleX={scaleLinear().domain([50, 60])}
    scaleY={scaleLinear().domain([50, 60])}
  >

    <Point x={55} y={55} radius={10} fill="blue" />
  
  </Section>

</Graphic>
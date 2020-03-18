<script>
  import {
    Graphic,
    Section,
    Polygon,
    XAxis,
    YAxis,
  } from '@snlab/florence'
  import { scaleLinear, scaleBand } from 'd3-scale'
  const width = 200
  const height = 200
</script>

<Graphic {width} {height}>
  <Section
    scaleX={scaleLinear().domain([0, 100])}
    scaleY={scaleLinear().domain([0, 100])}
    flipY
    padding={25}
  >
     <Polygon
      x={[20, 50, 80, 20]}
      y={[70, 21, 70, 70]} 
     />
    <XAxis tickCount={5}/>
    <YAxis tickCount={5}/>
  </Section>
</Graphic>
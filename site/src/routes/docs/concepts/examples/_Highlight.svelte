<script>
  import { Graphic, Section, PointLayer } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  let selectedIndex = null

  const a = [1, 3, 5, 3]
  const b = [3, 1, 3, 5]
  const name = ['West', 'North', 'East', 'South']
</script>

<Graphic width={300} height={300} backgroundColor="#b2ffb2">

  <Section 
    scaleX={scaleLinear().domain([1, 5])}
    scaleY={scaleLinear().domain([1, 5])}
    padding={20}
    clip={false}
  >

    <PointLayer 
      x={a}
      y={b}
      radius={10}
      fill={({ index }) => index === selectedIndex ? 'red' : 'black' }
      onMouseover={({ index }) => selectedIndex = index}
      onMouseout={() => selectedIndex = null}
    />

  </Section>

</Graphic>

<h1 style="color: blue;">{selectedIndex === null ? 'None selected' : name[selectedIndex]}</h1>

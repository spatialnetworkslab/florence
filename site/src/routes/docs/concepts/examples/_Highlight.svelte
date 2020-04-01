<script>
  import { Graphic, Section, PointLayer } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  let selectedKey = null

  const x = [1, 3, 5, 3]
  const y = [3, 1, 3, 5]
  const name = ['West', 'North', 'East', 'South']
</script>

<Graphic width={300} height={300} backgroundColor="#b2ffb2">

  <Section 
    scaleX={scaleLinear().domain([1, 5])}
    scaleY={scaleLinear().domain([1, 5])}
    padding={20}
  >

    <PointLayer 
      {x}
      {y}
      radius={10}
      fill={key => key === selectedKey ? 'red' : 'black' }
      onMouseover={({ key }) => selectedKey = key}
      onMouseout={() => selectedKey = null}
    />

  </Section>

</Graphic>

<h1 style="color: blue;">{selectedKey === null ? 'None selected' : name[selectedKey]}</h1>
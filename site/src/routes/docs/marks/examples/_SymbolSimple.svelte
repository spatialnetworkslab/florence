<script>
  import {
    XAxis,
    YAxis,
    Graphic,
    SymbolLayer,
    Section
  } from '@snlab/florence'
  import { scaleLinear, scaleTime } from 'd3-scale'
  const width = 200
  const height = 200
  const x = [
    new Date(2002, 0, 1),
    new Date(2004, 0, 1),
    new Date(2006, 0, 1)
  ]
  const y = [20, 40, 10]
  const shapes = ['star5', 'triangle-up', 'diamond']
  const scaleX = scaleTime()
    .domain([new Date(2001, 0, 1), new Date(2007, 0, 1)])
  const scaleY = scaleLinear()
    .domain([0, Math.max(...y)])
</script>

<Graphic {width} {height}>
  <Section
    {scaleX} {scaleY}
    flipY
    padding={20}
  >
    <SymbolLayer {x} {y} shape={shapes} />
    <XAxis />
    <YAxis />
  </Section>
</Graphic>

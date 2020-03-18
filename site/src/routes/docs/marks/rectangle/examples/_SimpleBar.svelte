<script>
  import {
    XAxis,
    YAxis,
    Graphic,
    RectangleLayer,
    Section
  } from '@snlab/florence'
  import { scaleLinear, scaleBand } from 'd3-scale'
  const width = 200
  const height = 200
  const x = [2002, 2004, 2006]
  const y = [20, 40, 10]
  const scaleX = scaleBand()
    .domain(x)
    .padding(0.5)
  const scaleY = scaleLinear()
    .domain([0, Math.max(...y)])
</script>

<Graphic {width} {height}>
  <Section
    {scaleX}
    {scaleY}
    flipY
    padding={20}
  >
     <RectangleLayer
      x1={x}
      x2={({ scaleX }) => x.map(value => scaleX(value) + scaleX.bandwidth())}
      y1={y}
      y2={0} />
    <XAxis />
    <YAxis />
  </Section>
</Graphic>
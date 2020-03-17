<script>
  import {
    XAxis,
    YAxis,
    Graphic,
    RectangleLayer,
    Title,
    Section
  } from '@snlab/florence'
  //   import { schemeCategory10 } from 'd3-scale-chromatic'
  import { scaleLinear, scaleBand } from 'd3-scale'
  const WIDTH = 500
  const HEIGHT = 200
  const x = [2000, 2005, 2010, 2015]
  const y = [100, 110, 130, 180]

  var scaleX = scaleBand()
    .domain(x)
    .padding(0.5)

  var scaleY = scaleLinear().domain([0, Math.max(...y)])
</script>

<Graphic width={WIDTH} height={HEIGHT}>
  <Title title={'Simple'} titleFontSize={'12'} />
  <Section
    {scaleX}
    {scaleY}
    flipY
    padding={{ top: 10, bottom: 30, left: 40, right: 10 }}>
    <RectangleLayer
      x1={x}
      x2={({ scaleX }) => x.map(d => scaleX(d) + scaleX.bandwidth())}
      y1={y}
      y2={0} />
    <XAxis />
    <YAxis />
  </Section>
</Graphic>

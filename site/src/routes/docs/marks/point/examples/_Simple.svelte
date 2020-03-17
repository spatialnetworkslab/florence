<script>
  import {
    XAxis,
    YAxis,
    Graphic,
    PointLayer,
    Title,
    Section
  } from '@snlab/florence'
  //   import { schemeCategory10 } from 'd3-scale-chromatic'
  import { scaleLinear, scaleTime } from 'd3-scale'
  const WIDTH = 500
  const HEIGHT = 200
  const x = [
    new Date(2000, 0, 1),
    new Date(2005, 0, 1),
    new Date(2010, 0, 1),
    new Date(2015, 0, 1)
  ]
  const y = [100, 110, 130, 180]
</script>

<Graphic width={WIDTH} height={HEIGHT}>
  <Title title={'Simple'} titleFontSize={'12'} />
  <Section
    scaleX={scaleTime().domain([new Date(2000, 0, 1), new Date(2016, 0, 1)])}
    scaleY={scaleLinear().domain([0, Math.max(...y)])}
    flipY
    padding={{ top: 10, bottom: 30, left: 40, right: 10 }}>
    <PointLayer {x} {y} radius={4} />
    <XAxis />
    <YAxis />
  </Section>
</Graphic>

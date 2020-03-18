<script>
  import {
    XAxis,
    YAxis,
    Graphic,
    PointLayer,
    Title,
    Section
  } from '@snlab/florence'

  import { scaleLinear, scalePoint } from 'd3-scale'
  const WIDTH = 500
  const HEIGHT = 200
  const planetName = [
    'Mercury',
    'Venus',
    'Earth',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune'
  ]
  const planetRadius = [2.44, 6.05, 6.37, 3.39, 70, 58.2, 25.4, 24.6]

  const scaleRadius = scaleLinear()
    .domain([Math.min(...planetRadius), Math.max(...planetRadius)])
    .range([0, 30])
</script>

<Graphic width={WIDTH} height={HEIGHT}>
  <Title title={'Solar system radius'} titleFontSize={'12'} />
  <Section
    scaleX={scalePoint().domain(planetName)}
    scaleY={scaleLinear().domain([0, 100])}
    flipY
    padding={{ top: 10, bottom: 30, left: 40, right: 40 }}>
    <PointLayer
      x={planetName}
      y={[50, 50, 50, 50, 50, 50, 50, 50]}
      fill={'#334d00'}
      radius={planetRadius.map(scaleRadius)} />
    <XAxis />
    <YAxis />
  </Section>
</Graphic>

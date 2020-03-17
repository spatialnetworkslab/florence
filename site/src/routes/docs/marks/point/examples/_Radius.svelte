<script>
  import {
    XAxis,
    YAxis,
    Graphic,
    PointLayer,
    Title,
    Section,
    LabelLayer
  } from '@snlab/florence'

  import { scaleLinear, scaleBand } from 'd3-scale'
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

  const planetScale = scaleBand()
    .domain(planetName)
    .range([0, WIDTH])
  const rRadius = scaleLinear()
    .domain([Math.min(...planetRadius), Math.max(...planetRadius)])
    .range([0, 30])

  var y = scaleLinear()
    .domain([0, 100])
    .range([0, HEIGHT])
</script>

<Graphic width={WIDTH} height={HEIGHT}>
  <Title title={'Solar system radius'} titleFontSize={'12'} />
  <Section flipY padding={{ top: 10, bottom: 30, left: 40, right: 10 }}>
    <LabelLayer
      text={planetName}
      x={planetName.map(planetScale)}
      y={[80, 80, 80, 80, 80, 80, 80, 80].map(y)} />
    <PointLayer
      x={planetName.map(planetScale)}
      y={[50, 50, 50, 50, 50, 50, 50, 50].map(y)}
      fill={'#334d00'}
      radius={planetRadius.map(rRadius)} />
    <!-- <PointLayer 
            x={[20, 40, 60, 80, 100, 120, 140].map(d => x(d))} 
            y={[50, 50, 50, 50, 50, 50, 50].map(d => y(d))} 
            fill={flameTemparatureGradient.map(d => fill(d))} 
            radius={4}/> -->
    <XAxis />
    <YAxis />
  </Section>
</Graphic>

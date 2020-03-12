<script>
import { XAxis, YAxis, Graphic, PointLayer, Title, LabelLayer, Section } from '@snlab/florence'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { scaleLinear, scaleBand } from 'd3-scale'
const WIDTH = 500
const HEIGHT = 200
const solarSystemDistances = [5.8 * 10 ^ 4, 1.108 * 10 ^ 5, 1.5 * 10 ^ 5, 2.28 * 10 ^ 5, 7.78 * 10 ^ 5, 1.43 * 10 ^ 6, 2.87 * 10 ^ 6, 4.5 * 10 ^ 6]
const planetName = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']
const planetRadius = [2.44, 6.05, 6.37, 3.39, 70, 58.2, 25.4, 24.6]
const flameTemparatureGradient = [20, 200, 600, 800, 1000, 1200, 1400]
const xDistance = scaleLinear()
  .domain([0, Math.max(...solarSystemDistances)])
  .range([0, WIDTH])

const planetScale = scaleBand()
  .domain(planetName)
  .range([0, WIDTH])
const rRadius = scaleLinear()
  .domain([Math.min(...planetRadius), Math.max(...planetRadius)])
  .range([0, 30])

var x = scaleLinear()
  .domain([0, 180])
  .range([0, WIDTH])

var r = scaleLinear()
  .domain([40, 130])
  .range([0, 6])

var y = scaleLinear()
  .domain([0, 100])
  .range([0, HEIGHT])

var fill = scaleLinear()
  .domain([20, 1400])
  .range(schemeCategory10)
</script>

<Graphic width={WIDTH} height={HEIGHT} >
    <Title title={'Flame Temparature Gradient'} titleFontSize={'12'}>
    </Title>
    <Section flipY padding={{ top: 10, bottom: 30, left: 40, right: 10 }}>
            <!-- <LabelLayer
                x={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map(d => x(d))} 
                y={[30, 30, 30, 30, 30, 30, 30, 30, 30, 30].map(d => y(d))} 
                text={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}>
            </LabelLayer> -->
        <!-- <PointLayer 
            x={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map(d => x(d))} 
            y={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50].map(d => y(d))} 
            fill={'#334d00'} 
            radius={[40, 50, 60, 70, 80, 90, 100, 110, 120, 130].map(d => r(d))}/> -->
        <PointLayer 
            x={planetName.map(d => planetScale(d))} 
            y={[50, 50, 50, 50, 50, 50, 50, 50].map(d => y(d))} 
            fill={'#334d00'} 
            radius={planetRadius.map(d => rRadius(d))}/>
        <!-- <PointLayer 
            x={[20, 40, 60, 80, 100, 120, 140].map(d => x(d))} 
            y={[50, 50, 50, 50, 50, 50, 50].map(d => y(d))} 
            fill={flameTemparatureGradient.map(d => fill(d))} 
            radius={4}/> -->
            <XAxis/>
            <YAxis/>
    </Section>
</Graphic> 
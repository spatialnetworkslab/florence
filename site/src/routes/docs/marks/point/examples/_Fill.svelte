<script>
import { XAxis, YAxis, Graphic, PointLayer, Title, Section } from '@snlab/florence'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { scaleLinear } from 'd3-scale'
const WIDTH = 500
const HEIGHT = 200
const flameTemparatureGradient = [20, 200, 600, 800, 1000, 1200, 1400]

var x = scaleLinear()
  .domain([0, 180])
  .range([0, WIDTH])

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
        <PointLayer 
            x={[20, 40, 60, 80, 100, 120, 140].map(d => x(d))} 
            y={[50, 50, 50, 50, 50, 50, 50].map(d => y(d))} 
            fill={flameTemparatureGradient.map(d => fill(d))} 
            radius={4}/>
            <XAxis/>
            <YAxis/>
    </Section>
</Graphic> 
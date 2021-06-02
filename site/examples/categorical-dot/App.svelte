<script>
  import { scaleLinear, scalePoint, scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'
  import { 
    Graphic, Section, PointLayer, XAxis, YAxis, Label, DiscreteLegend
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import _data from './data.js'

  const data = new DataContainer(_data)

  const scaleFruit = scalePoint()
    .domain(data.domain('fruit'))
    .padding(0.2)

  const maxMeanDiameter = data
    .groupBy('fruit')
    .summarise({ meanDiameter: { diameter: 'mean' } })
    .max('meanDiameter')

  const meanDiameterDomain = [0, maxMeanDiameter * 1.5]

  const scaleMeanDiameter = scaleLinear().domain(meanDiameterDomain)

  const scaleFruitColor = scaleOrdinal()
    .domain(data.domain('fruit'))
    .range(schemeCategory10.slice(0, 5))

  const scaleRadius = scaleLinear()
    .domain(meanDiameterDomain)
    .range([2, 10])
</script>


<Graphic width={400} height={400}>

  <Section
    padding={50}
    scaleX={scaleFruit}
    scaleY={scaleMeanDiameter}
  >

    <PointLayer
      x={data.column('fruit')}
      y={data.column('diameter')}
      fill={data.map('fruit', scaleFruitColor)}
      radius={data.map('diameter', scaleRadius)}
    />

    <XAxis title={'fruit'} />
    <YAxis title={'diameter/cm'} />
  
  </Section>

  <Label
    x={0.5}
    y={0.175}
    text={'Fruit Sizes'}
    fontFamily={'Baskerville'}
    fontSize={18}
  />

  <DiscreteLegend
    x1={0.75} x2={1}
    y1={0} y2={0.25}
    yDivider={0}
    fill={scaleFruitColor.range()}
    labels={scaleFruitColor.domain()}
    stroke={'white'}
    strokeWidth={2}
  /> 

</Graphic>

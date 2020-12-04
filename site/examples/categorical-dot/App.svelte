<script>
  import { scaleLinear, scalePoint, scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'
  import { 
    Graphic, PointLayer, XAxis, YAxis, Title, DiscreteLegend
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
    .range(schemeCategory10)

  const scaleRadius = scaleLinear()
    .domain(meanDiameterDomain)
    .range([2, 10])
</script>


<Graphic 
  width={400} height={400}
  padding={50}
  scaleX={scaleFruit}
  scaleY={scaleMeanDiameter}
>

  <Title 
    title={'Fruit Sizes'} 
    titleFontFamily={'Baskerville'}
    usePadding={true}
  />

  <PointLayer
    x={data.column('fruit')}
    y={data.column('diameter')}
    fill={data.map('fruit', scaleFruitColor)}
    radius={data.map('diameter', scaleRadius)}
  />

  <XAxis title={'fruit'} />
  <YAxis title={'diameter/cm'} />

  <DiscreteLegend
    fill={scaleFruitColor}
    hjust={'right'}
    vjust={'top'}
    stroke={'white'}
    strokeWidth={2}
    labelPaddingX={-12}
    labelAnchorPoint={'left'}
    usePadding={true}
  /> 

</Graphic>

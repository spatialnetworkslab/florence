<script context="module">
  export async function preload() {
    // instead of dealing with promises we await async functions here
    // this.fetch works on both client and server (as opposed to d3-fetch)
    const response = await this.fetch('/cars.json')
    const data = await response.json()

    return { data }
  }
</script>

<script>
  import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
  import { Graphic, Section, Label, XAxis, YAxis, PointLayer, Rectangle, Line } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  export let data

  // set up data container 
  const dataContainer = new DataContainer(data)
    .dropNA()
    .done()
  const domainX = dataContainer.domain('Horsepower')
  domainX[0] = 0
  const domainY = dataContainer.domain('Miles_per_Gallon')
  domainY[0] = 0

  const stats = dataContainer
    .summarise({
      mean_miles: { Miles_per_Gallon: 'mean' },
      count_miles: { Miles_per_Gallon: 'count' }
    })
    .done()

  const calcMean = arr => arr.reduce((acc, curr) => acc + curr) / stats.column('count_miles')
  const variance = calcMean(dataContainer.map('Miles_per_Gallon', el => Math.pow(el - stats.column('mean_miles'), 2)))
  const stdDev = Math.sqrt(variance)

  const scaleX = scaleLinear().domain(dataContainer.domain('Horsepower'))
  const scaleY = scaleLinear().domain(dataContainer.domain('Miles_per_Gallon'))
  const scaleColour = scaleOrdinal()
    .domain(dataContainer.domain('Origin'))
    .range(['#e45756', '#f58518', '#4c78a8'])

</script>

<Graphic 
  width={500}
  height={500}
>

  <Label
    x={250}
    y={10}
    text={'Scatterplot with mean and standard deviation overlay'}
  />

  <Section
    {scaleX}
    {scaleY}
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >  

    <Rectangle
      x1={domainX[0]}
      x2={domainX[1]}
      y1={stats.column('mean_miles')[0] - stdDev}
      y2={stats.column('mean_miles')[0] + stdDev}
      fill={'#c1d2e3'}
    />

    <Line
      x={domainX}
      y={[stats.column('mean_miles')[0], stats.column('mean_miles')[0]]}
      stroke={'#15212e'}
    />

    <PointLayer
      x={dataContainer.column('Horsepower')}
      y={dataContainer.column('Miles_per_Gallon')}
      stroke={'#4c78a8'}
      fillOpacity={0}
      strokeWidth={2}
      radius={4}
    />

    <XAxis
      title={'Horsepower'}
      titleFontWeight={'bold'}
    />

    <YAxis
      title='Miles per gallon'
      titleFontWeight={'bold'}
    />

  </Section>

</Graphic>
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
  import { Graphic, Section, Label, XAxis, YAxis, PointLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  export let data

  // set up data container 
  const dataContainer = new DataContainer(data)

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
    y={15}
    text={'Miles per gallon vs horsepower'}
  />

  <Section
    {scaleX}
    {scaleY}
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >  

   <PointLayer
     x={dataContainer.column('Horsepower')}
     y={dataContainer.column('Miles_per_Gallon')}
     stroke={dataContainer.map('Origin', scaleColour)}
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
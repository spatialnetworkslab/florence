<script>
  import { Graphic, Section, PointLayer, XAxis, YAxis, Label } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scalePoint, scaleLinear, scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'

  export let flipY = true
  export let switchAxes = false
  export let switchTitle = false
  export let switchColors = false

  const data = {
    diameter: [
      4.7, 6.1, 7.9, 6.6, 6.7, 5.3, 11.6, 11.1, 5.5, 10.6, 6.4,
      4.9, 8.8, 12.5, 12.7, 8.6, 13.1, 5.8, 8.9, 9.1, 10.3, 9.4, 0.5
    ],
  
    fruit: [
      'lime', 'lemon', 'grapefruit', 'lemon', 'orange', 'lemon', 
      'pomelo', 'grapefruit', 'lime', 'pomelo', 'lemon',
      'lime', 'grapefruit', 'pomelo', 'grapefruit', 'grapefruit',
      'pomelo', 'lime', 'orange', 'grapefruit', 'pomelo', 
      'grapefruit', 'anchovies'
    ]
  }

  const dataContainer = new DataContainer(data)
    .filter(row => row.fruit !== 'anchovies')

  const fruitDomain = dataContainer.domain('fruit')
  const scaleFruit = scalePoint().domain(fruitDomain).padding(0.2)
  const diameterDomain = [0, dataContainer.max('diameter')]
  const scaleDiameter = scaleLinear().domain(diameterDomain)

  const scaleFruitColor = scaleOrdinal()
    .domain(fruitDomain)
    .range(schemeCategory10)

  const scaleRadius = scaleLinear()
    .domain(diameterDomain)
    .range([2, 10])
</script>

<Graphic width={500} height={500}>

  <Section
    padding={40}
    scaleX={scaleFruit}
    scaleY={scaleDiameter}
    {flipY}
  >

    {#if switchColors === false}
      <PointLayer
        x={dataContainer.column('fruit')}
        y={dataContainer.column('diameter')}
      />
    {/if}

    {#if switchColors === true}
      <PointLayer
        x={dataContainer.column('fruit')}
        y={dataContainer.column('diameter')}
        fill={dataContainer.map('fruit', scaleFruitColor)}
        radius={dataContainer.map('diameter', scaleRadius)}
      />
    {/if}

    {#if switchAxes}
      <XAxis title={'fruit'} />
      <YAxis title={'diameter (cm)'} />
    {/if}

  </Section>

  {#if switchTitle}
    <Label
      x={250}
      y={70}
      text={'Fruit Sizes'}
      fontFamily={'Baskerville'}
      fontSize={18}
    />
  {/if}

</Graphic>
<script>
  import { scaleOrdinal } from 'd3-scale'
  import { json } from 'd3-fetch'
  import {
    Graphic,
    PointLayer,
    Label,
    XAxis,
    YAxis
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let dataContainer, scaleColor, ready

  (async () => {
    dataContainer = new DataContainer(await json('/data/cars.json'))
      .dropNA()

    scaleColor = scaleOrdinal()
      .domain(dataContainer.domain('Origin'))
      .range(["#e45756", "#f58518", "#4c78a8"])

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={400}
    height={400}
    scaleX={[0, dataContainer.max('Horsepower')]}
    scaleY={[0, dataContainer.max('Miles_per_Gallon')]}
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >

    <Label
      x={() => 200}
      y={() => 40}
      text={'Miles per gallon vs horsepower'}
      fontSize={18}
    />

    <PointLayer
      x={dataContainer.column('Horsepower')}
      y={dataContainer.column('Miles_per_Gallon')}
      fill={'#4c78a8'}
      opacity={0.5}
      radius={5}
    />

    <XAxis title={'Horsepower'} titleFontWeight={'bold'} />
    <YAxis title={'Miles per gallon'} titleFontWeight={'bold'} />
  
  </Graphic>

{/if}

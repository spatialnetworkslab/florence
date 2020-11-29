<script>
  import { csv } from 'd3-fetch'
  import { scaleLinear, scaleTime, scaleSequential } from 'd3-scale'
  import { interpolateRdBu } from 'd3-scale-chromatic'
  import { Graphic, PointLayer, Line, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let dataContainer, scaleColor, ready

  (async () => {
    const columnsOfInterest = 'Year,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'
      .split(',')

    const months = columnsOfInterest.slice(1)

    dataContainer = new DataContainer(await csv('/data/global-temp-trends.csv'))
      .select(columnsOfInterest)
      .pivotLonger({
        columns: months,
        namesTo: 'month',
        valuesTo: 'value'
      })
      .mutate({
        date: row => new Date(row.date, months.indexOf(row.month), 1),
        value: row => +row.value
      })

    scaleColor = scaleSequential()
      .domain(dataContainer.domain('value').reverse())
      .range(interpolateRdBu)

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={500}
    height={500}
    scaleX={scaleTime().domain(dataContainer.domain('date'))}
    scaleY={scaleLinear().domain(dataContainer.domain('value')).nice()}
    padding={{ left: 40, right: 30, top: 20, bottom: 30 }}
    flipY
  >
  
    <PointLayer
      x={dataContainer.column('date')}
      y={dataContainer.column('value')}
      radius={2.5}
      fill={dataContainer.map('value', scaleColor)}
      stroke={'#000'}
      strokeOpacity={0.2}
    />

    <Line
      x={dataContainer.domain('date')}
      y={[0, 0]}
      strokeWidth={0.2}
    />

    <XAxis baseLine={false} /> 
    <YAxis baseLine={false} /> 

  </Graphic>

{/if}

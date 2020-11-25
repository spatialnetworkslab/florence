<script>
  import { csv } from 'd3-fetch'
  import { format } from 'd3-format'
  import { timeDay, timeMonday } from 'd3-time'
  import { timeParse, timeFormat } from 'd3-time-format'
  import { scaleLinear, scaleLog, scaleBand } from 'd3-scale'
  import { Graphic, LineLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let appleStockData
  let scaleX
  let scaleY
  let ticksX

  csv('/data/apple-stocks-candlestick.csv', data => {
    const parseDate = timeParse('%Y-%m-%d')

    appleStockData = new DataContainer(data)
      .slice(-120)
      .mutate({
        Date: row => parseDate(row.Date),
        High: row => +row.High,
        Low: row => +row.Low,
        Open: row => +row.Open,
        Close: row => +row.Close
      })
      .mutate({

      })

    const noWeekend = d => d.getDay() !== 0 && d.getDay() !== 6

    scaleX = scaleBand().padding(0.2).domain(
      timeDay().range(appleStockData.domain('date')).filter(noWeekend)
    )

    scaleY = scaleLog().domain([
      appleStockData.min('Low'),
      appleStockData.max('High')
    ])

    tickX = timeMonday.every(1).range(domainDate[0], domainDate[1])
  })
</script>

{#if appleStockData}

  <Graphic
    width={500}
    height={500}
    padding={{ top: 20, bottom: 30, left: 40, right: 30 }}
    {scaleX}
    {scaleY}
  >

    <LineLayer 
      x={appleStockData.map('Date', d => [d, d])}
      y={}
    />
  
  </Graphic>

{/if}

<!-- <Graphic {width} {height}>

  {#if done}
    <Section
      {scaleX} 
      {scaleY}
      {padding}
      flipY
    >  

      <LineLayer
        x={dataContainer.map('date', d => [d, d])}
        y={dataContainer.rows().map(r => [r.low, r.high])}
        strokeWidth={1}
      />

      <LineLayer
        x={dataContainer.map('date', d => [d, d])}
        y={dataContainer.rows().map(r => [r.open, r.close])}
        strokeWidth={4}
        stroke={dataContainer.rows().map(r => r.open > r.close ? '#da344d'
          : r.close > r.open ? '#32936f'
          : '#32936f')}
      />

      <XAxis tickValues={xTicks} labelFormat={timeFormat('%-m/%-d')} baseLine={false} /> 
      <YAxis scale={scaleYAxis} labelFormat={format('$d')} baseLine={false} />

    </Section>
  {/if}

</Graphic> -->

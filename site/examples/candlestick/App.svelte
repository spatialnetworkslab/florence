<script>
  import { csv } from 'd3-fetch'
  import { format } from 'd3-format'
  import { autoType } from 'd3-dsv'
  import { timeDay, timeMonday } from 'd3-time'
  import { timeFormat } from 'd3-time-format'
  import { scaleLog, scaleBand } from 'd3-scale'
  import { Graphic, LineLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let appleStockData, scaleX, scaleY, ticksX

  (async () => {
    const data = await csv('/data/apple-stocks-candlestick.csv', autoType)
      .slice(-120)
    
    appleStockData = new DataContainer(data)
      .mutate({
        dates: row => [row.Date, row.Date],
        lowHigh: row => [row.Low, row.High],
        openClose: row => [row.Open, row.Close]
      })

    const noWeekend = d => d.getDay() !== 0 && d.getDay() !== 6

    scaleX = scaleBand().padding(0.2).domain(
      timeDay().range(appleStockData.domain('date')).filter(noWeekend)
    )

    scaleY = scaleLog().domain([
      appleStockData.min('Low'),
      appleStockData.max('High')
    ])

    ticksX = timeMonday.every(1).range(domainDate[0], domainDate[1])
  })()

  const openCloseColors = ([open, close]) => open > close ? '#da344d' : '#32936f'
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
      x={appleStockData.column('dates')}
      y={appleStockData.column('lowHigh')}
      strokeWidth={1}
    />

    <LineLayer
      x={appleStockData.column('dates')}
      y={appleStockData.column('openClose')}
      stroke={appleStockData.map('openClose', openCloseColors)}
      strokeWidth={4}
    />

    <XAxis tickValues={ticksX} labelFormat={timeFormat('%-m/%-d')} baseLine={false} /> 
    <YAxis labelFormat={format('$d')} baseLine={false} />
  
  </Graphic>

{/if}

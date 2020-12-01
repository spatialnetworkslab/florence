<script>
  import { csv } from 'd3-fetch'
  import { format } from 'd3-format'
  import { timeDay, timeMonday } from 'd3-time'
  import { timeParse, timeFormat } from 'd3-time-format'
  import { scaleLinear, scaleLog, scaleBand } from 'd3-scale'
  import { Graphic, LineLayer, XAxis, YAxis, YGridLines } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const parseDate = timeParse('%Y-%m-%d')
  
  let dataContainer, scaleX, scaleY, xTicks, ready

  (async () => {
    const data = await csv('/data/apple-stocks-candlestick.csv', d => ({
      Date:  parseDate(d.Date),
      High: +d.High,
      Low: +d.Low,
      Open: +d.Open,
      Close: +d.Close
    }))

    dataContainer = new DataContainer(data.slice(-120))
      .mutate({
        dates: r => [r.Date, r.Date],
        lowHigh: r => [r.Low, r.High],
        openClose: r => [r.Open, r.Close]
      })

    const domainDate = dataContainer.domain('Date')

    const weekdays = timeDay
      .range(domainDate[0], +domainDate[1] + 1)
      .filter(d => d.getDay() !== 0 && d.getDay() !== 6)

    scaleX = scaleBand()
      .domain(weekdays)
      .padding(0.2)
    
    scaleY = scaleLog().domain([
      dataContainer.min('Low'),
      dataContainer.max('High')
    ])

    xTicks = timeMonday.every(2).range(...domainDate)

    ready = true
  })()
</script>

{#if ready}

  <Graphic 
    width={500}
    height={500}
    {scaleX} 
    {scaleY}
    padding={{ top: 20, bottom: 30, left: 40, right: 30 }}
    flipY
  >

    <LineLayer
      x={dataContainer.column('dates')}
      y={dataContainer.column('lowHigh')}
      strokeWidth={1}
    />

    <LineLayer
      x={dataContainer.column('dates')}
      y={dataContainer.column('openClose')}
      strokeWidth={4}
      stroke={dataContainer.map('openClose', r => r[0] > r[1] ? '#da344d' : '#32936f') }
    />

    <XAxis tickValues={xTicks} labelFormat={timeFormat('%-m/%-d')} baseLine={false} /> 
    <YAxis labelFormat={format('$d')} baseLine={false} />
    <YGridLines />

  </Graphic>

{/if}

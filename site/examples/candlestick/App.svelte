<script>
  import { csv } from 'd3-fetch'
  import { format } from 'd3-format'
  import { timeDay, timeMonday } from 'd3-time'
  import { timeParse, timeFormat } from 'd3-time-format'
  import { scaleLinear, scaleLog, scaleBand } from 'd3-scale'
  import { Graphic, Section, LineLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const parseDate = timeParse('%Y-%m-%d')

  let done = false
  let data
  csv('/data/apple-stocks-candlestick.csv', d => {
    const date = parseDate(d['Date'])
    return {
      date,
      high: +d['High'],
      low: +d['Low'],
      open: +d['Open'],
      close: +d['Close']
    }
  }).then(d => {
    data = d.slice(-120)
    done = true
  })

  const padding = { top: 20, bottom: 30, left: 40, right: 30 }
  const width = 800
  const height = 600

  let dataContainer
  let domainHigh, domainLow, domainDate
  let scaleX, scaleY
  let xTicks

  $: {
    if (done) {
      dataContainer = new DataContainer(data)

      domainHigh = dataContainer.domain('high')
      domainLow = dataContainer.domain('low')
      domainDate = dataContainer.domain('date')

      scaleX = scaleBand()
        .domain(
          timeDay
            .range(domainDate[0], +domainDate[1] + 1)
            .filter(d => d.getDay() !== 0 && d.getDay() !== 6)
        )
        .padding(0.2)
      scaleY = scaleLog().domain([domainLow[0], domainHigh[1]])

      xTicks = timeMonday.every(1).range(domainDate[0], domainDate[1])
    }
  }
</script>

<Graphic {width} {height}>

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
      <YAxis labelFormat={format('$d')} baseLine={false} />

    </Section>
  {/if}

</Graphic>

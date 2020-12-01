<script>
  import { csv } from 'd3-fetch'
  import { format } from 'd3-format'
  import { timeDay, timeMonday } from 'd3-time'
  import { timeParse, timeFormat } from 'd3-time-format'
  import { scaleLinear, scaleLog, scaleBand } from 'd3-scale'
  import { Graphic, LineLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const parseDate = timeParse('%Y-%m-%d')
  const padding = { top: 20, bottom: 30, left: 40, right: 30 }
  const width = 800
  const height = 600
  const dataURL = '/data/apple-stocks-candlestick.csv'
  
  let dataContainer, scaleX, scaleY, xTicks, done

  (async () => {
    const data = await csv(dataURL, d => ({
      Date:  parseDate(d.Date),
      High: +d.High,
      Low: +d.Low,
      Open: +d.Open,
      Close: +d.Close
    }))

    dataContainer = new DataContainer(data.slice(-120))

    const domainHigh = dataContainer.domain('High')
    const domainLow = dataContainer.domain('Low')
    const domainDate = dataContainer.domain('Date')

    const weekdays = timeDay
      .range(domainDate[0], +domainDate[1] + 1)
      .filter(d => d.getDay() !== 0 && d.getDay() !== 6)

    scaleX = scaleBand()
      .domain(weekdays)
      .padding(0.2)
    
    scaleY = scaleLog().domain([domainLow[0], domainHigh[1]])

    xTicks = timeMonday.every(1).range(domainDate[0], domainDate[1])

    done = true
  })()

  // let data
  // csv('/data/apple-stocks-candlestick.csv', d => {
  //   const date = parseDate(d['Date'])
  //   return {
  //     Date: date,
  //     High: +d['High'],
  //     Low: +d['Low'],
  //     Open: +d['Open'],
  //     Close: +d['Close']
  //   }
  // }).then(d => {
  //   data = d.slice(-120)
  //   done = true
  // })

  // const padding = { top: 20, bottom: 30, left: 40, right: 30 }
  // const width = 800
  // const height = 600

  // let dataContainer
  // let scaleX, scaleY
  // let xTicks

  // $: {
  //   if (done) {
  //     dataContainer = new DataContainer(data)

  //     const domainHigh = dataContainer.domain('High')
  //     const domainLow = dataContainer.domain('Low')
  //     const domainDate = dataContainer.domain('Date')

  //     const weekdays = timeDay
  //       .range(domainDate[0], +domainDate[1] + 1)
  //       .filter(d => d.getDay() !== 0 && d.getDay() !== 6)

  //     scaleX = scaleBand()
  //       .domain(weekdays)
  //       .padding(0.2)
  //     scaleY = scaleLog().domain([domainLow[0], domainHigh[1]])

  //     xTicks = timeMonday.every(1).range(domainDate[0], domainDate[1])
  //   }
  // }
</script>

{#if done}

  <Graphic 
    {width}
    {height}
    {scaleX} 
    {scaleY}
    {padding}
    flipY
  >

    <LineLayer
      x={dataContainer.map('Date', d => [d, d])}
      y={dataContainer.rows().map(r => [r.Low, r.High])}
      strokeWidth={1}
    />

    <LineLayer
      x={dataContainer.map('Date', d => [d, d])}
      y={dataContainer.rows().map(r => [r.Open, r.Close])}
      strokeWidth={4}
      stroke={dataContainer.rows().map(r => r.Open > r.Close ? '#da344d' : '#32936f') }
    />

    <XAxis tickValues={xTicks} labelFormat={timeFormat('%-m/%-d')} baseLine={false} /> 
    <YAxis labelFormat={format('$d')} baseLine={false} />

  </Graphic>

{/if}

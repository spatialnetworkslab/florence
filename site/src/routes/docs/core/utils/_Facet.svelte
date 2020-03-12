<script>
  import { scaleLinear, scaleLog, scaleBand } from 'd3-scale'
  import { timeDay, timeMonday } from 'd3-time'
  import { timeFormat } from 'd3-time-format'
  import {
    Section,
    Label,
    LineLayer,
    XAxis,
    YAxis
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  export let data
  export let padding = { top: 20, bottom: 30, left: 40, right: 30 }
  export let width = 800
  export let height = 600
  export let x1 = 0
  export let x2 = 600
  export let y1 = 0
  export let y2 = 500
  export let chartTitle = ''
  // set up data container
  const dataContainer = new DataContainer(data)

  const domainHigh = dataContainer.domain('high')
  const domainLow = dataContainer.domain('low')
  const domainDate = dataContainer.domain('date')

  // set scales
  const scaleX = scaleBand()
    .domain(
      timeDay
        .range(domainDate[0], +domainDate[1] + 1)
        .filter(d => d.getDay() !== 0 && d.getDay() !== 6)
    )
    .padding(0.2)
  const scaleY = scaleLinear()
    .domain([domainLow[0], domainHigh[1]])
    .range([height - padding.bottom, padding.top])

  // configure axes
  const xTicks = timeMonday.every(7).range(domainDate[0], domainDate[1])
  const scaleYAxis = scaleLinear()
    .domain([domainLow[0], domainHigh[1]])
    .range([height - padding.bottom, padding.top])
  $: console.log(height, padding)
  const onPan = e => console.log(e)
</script>

<Section {x1} {x2} {y1} {y2} {onPan} {scaleX} {scaleY} {padding} flipY>
  <!-- <Label x={0} y={0} text={chartTitle} /> -->
  <LineLayer
    x={dataContainer.map('date', d => [d, d])}
    y={dataContainer.rows().map(r => [r.low, r.high])}
    strokeWidth={1} />

  <LineLayer
    x={dataContainer.map('date', d => [d, d])}
    y={dataContainer.rows().map(r => [r.open, r.close])}
    strokeWidth={4}
    stroke={dataContainer
      .rows()
      .map(r =>
        r.open > r.close ? '#da344d' : r.close > r.open ? '#32936f' : '#32936f'
      )} />

  <XAxis
    tickValues={xTicks}
    labelFormat={timeFormat('%-m/%-d')}
    baseLine={false} />

  <YAxis baseLine={false} />
</Section>

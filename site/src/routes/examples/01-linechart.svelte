<script context="module">
  import { csvParse, autoType } from 'd3-dsv'
  export async function preload() {
    // instead of dealing with promises we await async functions here
    // this.fetch works on both client and server (as opposed to d3-fetch)
    const response = await this.fetch('/stocks.csv')
    const text = await response.text()

    const data = csvParse(text, autoType) // auto-infer type if possible
    return { data }
  }
</script>

<script>
  import { scaleLinear, scaleTime } from 'd3-scale'
  import { Graphic, Section, Label, LineLayer, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  export let data

  // set up data container, force string date to Date
  const loadedData = new DataContainer(data)
      .mutate({ realDate: row => new Date(row.date) })
      .select(['symbol', 'realDate', 'price'])
      .rename({ realDate: 'date' })
      .done()

  // set scales based on ungrouped data
  const scaleX = scaleTime().domain(loadedData.domain('date')).nice()
  const scaleY = scaleLinear().domain(loadedData.domain('price')).nice()

  // group data by symbol so we can plot one line per group
  const groupedData = loadedData.groupBy('symbol').done()

  let options = {
    flip: 'false',
    vjust: 'bottom',
    y: undefined,
    yOffset: 0,
    ticks: 'true',
    tickCount: '8',
    tickValues: '',
    tickSize: 5,
    tickWidth: 0.5,
    tickColor: 'black',
    tickOpacity: 1,
    tickExtra: 'false',
    baseLine: 'true',
    baseLineColor: 'black',
    baseLineOpacity: 1,
    baseLineWidth: 1,
    labelFormat: undefined,
    labelOffset: 2,
    labelRotate: 0,
    labelFont: "Helvetica",
    labelFontSize: 10,
    labelFontWeight: 'normal',
    labelOpacity: 1,
    labelColor: 'black',
    titleHjust: 'center',
    titleXOffset: 0,
    titleYOffset: 'axis',
    titleVjust: 'axis',
    title: 'date',
    titleColor: 'black',
    titleFont: 'Helvetica',
    titleFontSize: '12',
    titleFontWeight: 'bold',
    titleOpacity: 1,
    titleRotation: 0,
    titleAnchorPoint: 't',
    transition: 2000
  }

</script>

<Graphic 
  width={500}
  height={500}
>
  <Label
    x={250}
    y={25}
    text={'Stock prices of 5 tech companies over time'}
  />

  <Section
    {scaleX}
    {scaleY}
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >  

    <LineLayer
      x={groupedData.map('$grouped', group => group.column('date'))}
      y={groupedData.map('$grouped', group => group.column('price'))}
      stroke={[['#54a24b'], ['#f58518'], ['#72b7b2'], ['#e45756'], ['#4c78a8']]}
    />

    <XAxis
      yOffset={Number(options.yOffset)}
      flip={options.flip === 'true'}
      vjust={isNaN(options.vjust) ? options.vjust : Number(options.vjust)}
      y={Number(options.y)}
      baseLine={options.baseLine === 'true'}
      ticks={options.ticks === 'true'}
      tickCount={Number(options.tickCount)}
      tickValues={(options.tickValues.length > 0) ? options.tickValues.split(',') : []}
      tickSize={Number(options.tickSize)}
      tickWidth={Number(options.tickWidth)}
      tickColor={options.tickColor}
      tickOpacity={Number(options.tickOpacity)}
      tickExtra={options.tickExtra === 'true'}
      baseLineOpacity={Number(options.baseLineOpacity)}
      baseLineWidth={Number(options.baseLineWidth)}
      baseLineColor={options.baseLineColor}
      labelFormat = {options.labelFormat}
      labelOffset = {Number(options.labelOffset)}
      labelRotate = {Number(options.labelRotate)}
      labelFont = {options.labelFont}
      labelFontSize = {Number(options.labelFontSize)}
      labelFontWeight = {options.labelFontWeight}
      labelOpacity = {Number(options.labelOpacity)}
      labelColor={options.labelColor}
      titleHjust={options.titleHjust}
      titleXOffset={Number(options.titleXOffset)}
      titleYOffset={options.titleYOffset}
      titleVjust={options.titleVjust}
      title={options.title}
      titleColor={options.titleColor}
      titleFont={options.titleFont}
      titleFontSize={Number(options.titleFontSize)}
      titleFontWeight={options.titleFontWeight}
      titleOpacity={Number(options.titleOpacity)}
      titleRotation={Number(options.titleRotation)}
      titleAnchorPoint={options.titleAnchorPoint}
      transition={Number(options.transition)}
    />

    <YAxis
      hjust={'left'}
      baseLineWidth={1}
      title='price'
      titleFontWeight={options.titleFontWeight}
    />

  </Section>

</Graphic>
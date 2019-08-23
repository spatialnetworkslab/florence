<script context="module">
  export async function preload() {
    // instead of dealing with promises we await async functions here
    // this.fetch works on both client and server (as opposed to d3-fetch)
    const response = await this.fetch('/movies.json')
    const data = await response.json()

    return { data }
  }
</script>

<script>
  import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
  import { Graphic, Section, Label, LineLayer, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  export let data
  let reformattedData = data.map(d => {
    return {
      Title: String(d.Title),
      Rotten_Tomatoes_Rating: d.Rotten_Tomatoes_Rating,
      IMDB_Rating: d.IMDB_Rating,
    }
  })

  // set up data container 
  // const dataContainer = new DataContainer(
  // { a: [1, 2, 3, 4, 5, 6, 7], b: [8, 9, 10, 11, 12, 13, 14] }
  // )
  // const binned = dataContainer.bin({ groupBy: 'a', method: 'EqualInterval', numClasses: 3 }).done()

  const dataContainer = new DataContainer(reformattedData)
  const binned = dataContainer
    .dropNA()
    .bin({ groupBy: 'IMDB_Rating', method: 'EqualInterval', numClasses: 3 })
    .done()

  // set scales based on ungrouped data

  // group data by symbol so we can plot one line per group

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

  <Section
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >  

    <!-- <XAxis
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
    /> -->

  </Section>

</Graphic>
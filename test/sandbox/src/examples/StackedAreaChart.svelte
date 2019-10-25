<script>
  import { scaleLinear, scaleUtc, scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'
  import { Graphic, Section, Area, XAxis, YAxis } from '../../../../src'
  import { autoType } from 'd3-dsv'
  import { csv } from 'd3-fetch'
  import DataContainer from '@snlab/florence-datacontainer'

  const padding = {top: 20, right: 20, bottom: 30, left: 40}

  // set to true once data is loaded
  let done

  let parsedData
  csv('https://gist.githubusercontent.com/mbostock/7d600b18fdea7542393d23e990a887b7/raw/df6ef37f1f22cae3d1583ab60ba613fed5e81397/unemployment.csv', autoType)
    .then((d) => { parsedData = d; done = true })

  let columnNames
  let dataContainer, rowCumSum
  let unemploymentDomain, dateDomain
  let scaleDate, scaleUnemployment, scaleColor

  $: { 
    if (done) {
      columnNames = parsedData.columns.splice(1)

      dataContainer = new DataContainer(parsedData)

      rowCumSum = dataContainer.rowCumsum([
        'Wholesale and Retail Trade',
        'Manufacturing',
        'Leisure and hospitality',
        'Business services',
        'Construction',
        'Education and Health',
        'Government',
        'Finance',
        'Self-employed',
        'Other',
        'Transportation and Utilities',
        'Information',
        'Agriculture',
        'Mining and Extraction'
      ], { asInterval: 'true' })

      dateDomain = rowCumSum.domain('date')
      unemploymentDomain = rowCumSum.domain('Mining and Extraction')

      scaleDate = scaleUtc().domain(dateDomain)
      scaleUnemployment = scaleLinear().domain([0, unemploymentDomain[1]])
      scaleColor = scaleOrdinal()
        .domain(parsedData.columns.slice(1))
        .range(schemeCategory10)
    } 
  }
</script>

<Graphic
  width={700}
  height={500}
>

  {#if done}
    <Section
      scaleX={scaleDate}
      scaleY={scaleUnemployment}
      {padding}
      flipY
    >
      {#each columnNames as c}
        <Area
          x1={rowCumSum.column('date')}
          y1={rowCumSum.column(c).map(d => d[0])}
          y2={rowCumSum.column(c).map(d => d[1])}
          fill={scaleColor(c)}
        />
      {/each}

      <XAxis
        baseLine={false}
      />

      <YAxis
        baseLine={false}
        title={'Unemployment'}
        titleVjust={'top'}
        titleHjust={0.05}
        titleRotation={0}
        titleFontWeight={'bold'}
      />

    </Section>
  {/if} 

</Graphic>

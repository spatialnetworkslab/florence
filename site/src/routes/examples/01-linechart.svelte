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
  import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
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
  const scaleColour = scaleOrdinal()
    .domain(loadedData.domain('symbol'))
    .range(['#54a24b', '#f58518', '#72b7b2', '#e45756', '#4c78a8'])

  // group data by symbol so we can plot one line per group
  const groupedData = loadedData.groupBy('symbol').done()

</script>

<Graphic 
  width={500}
  height={500}
>
  <Label
    x={250}
    y={10}
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
      stroke={groupedData.map('$grouped', group => scaleColour(group.column('symbol')))}
    />
    
    <XAxis
      title={'date'}
      titleFontWeight={'bold'}
    />

    <YAxis
      title='price'
      titleFontWeight={'bold'}
    />

  </Section>

</Graphic>
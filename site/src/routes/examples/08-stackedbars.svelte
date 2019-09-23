<!-- adapted from https://observablehq.com/@d3/stacked-horizontal-bar-chart -->

<script context="module">  
  export async function preload() {
    const response = await this.fetch('https://gist.githubusercontent.com/mbostock/5429c74d6aba68c52c7b39642c98deed/raw/50a5157a1d920191b0a7f636796ee721047cbb92/us-population-state-age.csv')
    const text = await response.text()
    return { text }
  }
</script>

<script>
  import { csvParse, autoType } from 'd3-dsv'
  import { sum } from 'd3-array'
  import { stack } from 'd3-shape'
  import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale'
  import { quantize } from 'd3-interpolate'
  import { interpolateSpectral } from 'd3-scale-chromatic'
  import { Graphic, Section, Label, RectangleLayer, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  export let text

  const data = (csvParse(text, (d, i, columns) => (
      autoType(d),
      d.total = sum(columns, c => d[c]),
      d
    ))).sort((a, b) => b.total - a.total)

  // stack data
  const stacked = stack().keys(data.columns.slice(1))(data)
  
  const dataContainer = new DataContainer(data)
  const nameDomain = dataContainer.domain('name')
  const totalDomain = dataContainer.domain('total')

  // set scales
  const scaleX = scaleLinear().domain(totalDomain)
  const scaleY = scaleBand().domain(nameDomain).padding(0.1)
  const scaleColor = scaleOrdinal()
    .domain(stacked.map(d => d.key))
    .range(quantize(t => interpolateSpectral(t * 0.8 + 0.1), stacked.length).reverse())
    .unknown("#ccc")

</script>

<Graphic
  width={800}
  height={1330}
>

  <Label
    x={400}
    y={10}
    text={'Stacked Horizontal Bar Chart'}
  />

  <Section
    {scaleX} 
		{scaleY}
    padding={{left: 30, right: 10, top: 30, bottom: 0}}
  >  

    {#each stacked as stack, i}
      <RectangleLayer
        x1={stack.map(s => s[0])}
        x2={stack.map(s => s[1])}
        y1={nameDomain}
        y2={({ scaleY }) => nameDomain.map(n => scaleY(n) + scaleY.bandwidth()) }
        fill={stacked.map(n => scaleColor(n.key))[i]}
      />
    {/each}

    <XAxis
      vjust={'top'}
      baseLine={false}
    /> 

    <YAxis
      baseLine={false}
    />

  </Section>

</Graphic>
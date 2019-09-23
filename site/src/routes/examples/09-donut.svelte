<!-- adapted from https://observablehq.com/@d3/donut-chart -->

<script context="module">  
  export async function preload() {
    const response = await this.fetch('https://gist.githubusercontent.com/mbostock/a3541c73fdccd432acc8b11bf9f02641/raw/2bd0fce0bf34b020e93c5f6527b5a9d08c33ff06/population-by-age.csv')
    const text = await response.text()
    return { text }
  }
</script>

<script>
  import { csvParse, autoType } from 'd3-dsv'
  import { scaleLinear, scaleOrdinal } from 'd3-scale'
  import { quantize } from 'd3-interpolate'
  import { interpolateSpectral } from 'd3-scale-chromatic'
  import { Graphic, Section, Label, Rectangle, RectangleLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  export let text

  const data = csvParse(text, (d) => (autoType(d)))

  const dataContainer = new DataContainer(data)
  const cumsum = dataContainer.cumsum({ cumsum: 'value' })

  const scaleX = scaleLinear().domain([0, cumsum.domain('cumsum')[1]])
  const scaleY = scaleLinear().domain([0, 15])
  const scaleColor = scaleOrdinal()
    .domain(cumsum.domain('name'))
    .range(quantize(t => interpolateSpectral(t * 0.8 + 0.1), cumsum.rows().length).reverse())

</script>

<Graphic
  width={500}
  height={530}
>

  <Label
    x={250}
    y={10}
    text={'Donut Chart'}
  />

 <!-- apply a polar transformation on the data -->
  <Section
    {scaleX}
    {scaleY}
    padding={{top: 30, bottom: 0, left: 0, right: 0}}
    transformation={'polar'}
  >  

    {#each cumsum.rows() as row, i}
      <Rectangle
        x1={i === 0 ? 0 : cumsum.prevRow(row.$key).cumsum}
        x2={row.cumsum}
        y1={10}
        y2={15}
        fill={scaleColor(row.name)}
        stroke={'white'}
        strokeWidth={1}
      />

      <Label
        x={i === 0 ? 0 + row.value/2 : cumsum.prevRow(row.$key).cumsum + row.value/2}
        y={12.5}
        text={row.name}
        fontSize={11}
        fontWeight={'bold'}
      />
      
      {#if row.value >= 14547446}
        <Label
          x={i === 0 ? 0 + row.value/2 : cumsum.prevRow(row.$key).cumsum + row.value/2}
          y={12.5}
          text={row.value.toLocaleString()}
          fontSize={11}
          fontWeight={'lighter'}
          zoomIdentity={ { x: 0, y: 15, kx: 1, ky: 1 } }
        />
      {/if}
    {/each}

  </Section>

</Graphic>
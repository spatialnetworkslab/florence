<!-- adapted from https://vega.github.io/vega-lite/examples/rect_binned_heatmap.html -->

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
  import { scaleLinear, scaleSequential } from 'd3-scale'
  import { interpolateYlGnBu } from 'd3-scale-chromatic'
  import { Graphic, Section, Label, Rectangle, RectangleLayer, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  export let data
  
  let reformattedData = data.map(d => {
    return {
      Title: String(d.Title),
      Rotten_Tomatoes_Rating: d.Rotten_Tomatoes_Rating,
      IMDB_Rating: d.IMDB_Rating
    }
  })

  const dataContainer = new DataContainer(reformattedData)

  const binned = dataContainer
    .dropNA()
    .bin([
      { groupBy: 'IMDB_Rating', method: 'EqualInterval', numClasses: 38 },
      { groupBy: 'Rotten_Tomatoes_Rating', method: 'EqualInterval', numClasses: 20 }
    ])
    .summarise({ count: { IMDB_Rating: 'count' } })

  const imdbDomain = binned.domain('bins_IMDB_Rating') // [1.6, 9.2]
  const rtDomain = binned.domain('bins_Rotten_Tomatoes_Rating') // [1, 100]
  const countDomain = binned.domain('count')

  const scaleX = scaleLinear().domain(imdbDomain)
  const scaleY = scaleLinear().domain(rtDomain)
  const scaleColor = scaleSequential(interpolateYlGnBu).domain(countDomain)

</script>

<Graphic 
  width={600}
  height={400}
>

  <Label
    x={300}
    y={10}
    text={'Table Binned Heat Map'}
  />

  <Section
    {scaleX}
    {scaleY}
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >

  {#each binned.rows() as bin}
    <Rectangle
      x1={bin['bins_IMDB_Rating'][0]}
      x2={bin['bins_IMDB_Rating'][1]}
      y1={bin['bins_Rotten_Tomatoes_Rating'][0]}
      y2={bin['bins_Rotten_Tomatoes_Rating'][1]}
      fill={scaleColor(bin['count'])}
    />
  {/each}

  <XAxis
    title={"IMDB Rating"}
    baseLine={false}
  />

  <YAxis
    title={"Rotten Tomatoes Rating"}
    baseLine={false}
  />

  </Section>

</Graphic>
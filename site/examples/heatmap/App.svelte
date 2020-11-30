<script>
  import { scaleSequential } from 'd3-scale'
  import { interpolateYlGnBu } from 'd3-scale-chromatic'
  import { json } from 'd3-fetch'
  import { Graphic, RectangleLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let dataContainer, scaleColor, ready

  (async () => {
    dataContainer = new DataContainer(await json('/data/imdb.json'))
      .select(['IMDB Rating', 'Rotten Tomatoes Rating'])
      .dropNA()
      .bin([
        { column: 'IMDB Rating', method: 'EqualInterval', numClasses: 38 },
        { column: 'Rotten Tomatoes Rating', method: 'EqualInterval',  numClasses: 20 }
      ])
      .summarise({
        count: { 'IMDB Rating': 'count' }
      })

    scaleColor = scaleSequential(interpolateYlGnBu)
      .domain(dataContainer.domain('count'))

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={500}
    height={500}
    scaleX={dataContainer.domain('bins_IMDB Rating')}
    scaleY={dataContainer.domain('bins_Rotten Tomatoes Rating')}
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >

    <RectangleLayer
      x1={dataContainer.map('bins_IMDB Rating', bin => bin[0])}
      x2={dataContainer.map('bins_IMDB Rating', bin => bin[1])}
      y1={dataContainer.map('bins_Rotten Tomatoes Rating', bin => bin[0])}
      y2={dataContainer.map('bins_Rotten Tomatoes Rating', bin => bin[1])}
      fill={dataContainer.map('count', scaleColor)}
    />

    <XAxis title={"IMDB Rating"} baseLine={false} />
    <YAxis title={"Rotten Tomatoes Rating"} baseLine={false} />
  
  </Graphic>

{/if}

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

</script>

<Graphic 
  width={500}
  height={500}
>

  <Section
    padding={{left: 40, right: 25, top: 25, bottom: 40}}
    flipY
  >  

  </Section>

</Graphic>
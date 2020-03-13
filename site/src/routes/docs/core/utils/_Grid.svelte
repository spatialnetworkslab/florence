<script>
  import { onMount } from 'svelte'
  import { Graphic, Grid } from '@snlab/florence'
  import Facet from './_Facet.svelte'

  import { csv } from 'd3-fetch'
  import { autoType, csvParse } from 'd3-dsv'
  import { timeParse } from 'd3-time-format'
  export let columns = 2
  export let rows = 2

  export let x1 = 0
  export let x2 = 1200
  export let y1 = 0
  export let y2 = 1200
  export let rowGap = 0
  export let columnGap = 0
  // const data = []
  let dataGroup = []

  const areaNames = ['Coca Cola', 'Tesla', 'Kratos', 'Apple', 'a']

  const parseDate = timeParse('%Y-%m-%d')
  onMount(async () => {
    await Promise.all([
      csv('/COKE.csv'),
      csv('/TSLA.csv'),
      csv('/KRA.csv'),
      csv('/AAPL.csv')
    ]).then(all => {
      // console.log(all)
      dataGroup = all.map(t =>
        t.map(d => {
          const date = parseDate(d.Date)
          return {
            date,
            high: +d.High,
            low: +d.Low,
            open: +d.Open,
            close: +d.Close
          }
        })
      )
    })

    //   csv('/TSLA.csv').then(async d => {
    //     // console.log(d)
    //   })
  })
  // $:console.log(dataGroup)
</script>

<!-- <div>
  <label for="cols-slider">Columns:</label>
  <input type="range" min="1" max="4" bind:value={columns} name="cols-slider" />
</div> -->

<Graphic padding={50} width={1200} height={1200}>
  {#if dataGroup.length}
    <Grid
      {x1}
      {x2}
      {y1}
      {y2}
      columns={2}
      rows={2}
      {rowGap}
      {columnGap}
      {areaNames}
      let:cells>

      {#each areaNames as facet, i}
        <Facet chartTitle={facet} {...cells[facet]} flipY data={dataGroup[i]} />
      {/each}
    </Grid>
  {/if}
</Graphic>

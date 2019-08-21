<script context="module">
  import { csv } from 'd3-fetch'
  export async function preload() {
    const data = csv('/stocks.csv')
    return { data }
  }
</script>

<script>
  import { scaleLinear, scaleTime } from 'd3-scale'
  import { Graphic, Section, LineLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

  export let data
  let loadedData
  data.then(d => {
    loadedData = new DataContainer(d)
      .mutate({ realDate: row => new Date(row.date) })
      .select(['symbol', 'realDate', 'price'])
      .rename({ realDate: 'date' })
      .groupBy('symbol')
      .done()
  })

  const log = console.log

  // let data = [
  //   { symbol: "MSFT", date: "Jan 1 2000", price: "39.81" },
  //   { symbol: "MSFT", date: "Feb 1 2000", price: "36.35" },
  //   { symbol: "MSFT", date: "Mar 1 2000", price: "43.22" }
  // ]
  // log('data', data)
  // log('dates', data.map(d => new Date(d.date)))
  // log('prices', data.map(d => +d.price))

  const scaleX = scaleTime().domain([new Date("2000-01-01 00:00:00"), new Date("2010-03-01 00:00:00")]).range([50, 250])
  // $: {
  //   if (loadedData) {
  //     log(loadedData.map(d => scaleX(new Date(d.date))))
  //   }
  // }

</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
</div>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
  </select>
</div>

<div>
  <label for="duration">Transition time</label>
  <input name="duration" type="range" min="100" max="5000" bind:value={duration} />
</div>


<Graphic 
  width={500} {height}
>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleTime().domain([new Date("2000-01-01 00:00:00"), new Date("2010-03-01 00:00:00")])}
    scaleY={scaleLinear().domain([0, 800])}
  >

    {#if loadedData}
      
      <LineLayer
        x={loadedData.map('$grouped', group => group.column('date'))}
        y={loadedData.map('$grouped', group => group.column('price'))}
      />

    {/if}

  </Section>

</Graphic>
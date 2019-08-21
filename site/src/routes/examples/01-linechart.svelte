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
  import { scaleLinear, scaleTime } from 'd3-scale'
  import { Graphic, Section, LineLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

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

  // group data by symbol so we can plot one line per group
  const groupedData = loadedData.groupBy('symbol').done()

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
    {scaleX}
    {scaleY}
  >
    
      <LineLayer
        x={groupedData.map('$grouped', group => group.column('date'))}
        y={groupedData.map('$grouped', group => group.column('price'))}
      />

  </Section>

</Graphic>
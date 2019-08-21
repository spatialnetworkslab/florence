<script>
  import { scaleLinear } from 'd3-scale'
  import { csv } from 'd3-fetch'
  import { Graphic, Section, LineLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

  const log = console.log
  let data
  csv('/stocks.csv').then((d) => data = d)

  // let data = [
  //   { symbol: "MSFT", date: "Jan 1 2000", price: "39.81" },
  //   { symbol: "MSFT", date: "Feb 1 2000", price: "36.35" },
  //   { symbol: "MSFT", date: "Mar 1 2000", price: "43.22" }
  // ]
  // log('data', data)
  // log('dates', data.map(d => new Date(d.date)))
  // log('prices', data.map(d => +d.price))

  $: log('data', data)

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
  scaleX={scaleLinear().domain([0, 500])}
  scaleY={scaleLinear().domain([0, 500])}
>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
  >

    <LineLayer
      x={data.map(d => new Date(d.date))}
      y={data.map(d => +d.price)}
      stroke={'black'}
      strokeWidth={10}
    />

  </Section>

</Graphic>
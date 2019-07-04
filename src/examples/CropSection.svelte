<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Rectangle, Point } from '../sveg'

  let x1 = 0
  let x2 = 10
  let y1 = 0
  let y2 = 10

  $: domainX = [x1, x2]
  $: domainY = [y1, y2]

  let points = [
    [0, 0],
    [0, 5],
    [0, 10],
    [5, 10],
    [10, 10],
    [10, 5],
    [10, 0],
    [5, 0],
    [5, 5],

    [2.5, 2.5],
    [2.5, 7.5],
    [7.5, 7.5],
    [7.5, 2.5]
  ]
</script>

<div>

  domain x:

  <input type="number" bind:value={x1} />
  <input type="number" bind:value={x2} />

  <br />

  domain y:

  <input type="number" bind:value={y1} />
  <input type="number" bind:value={y2} />

</div>

<Graphic width={500} height={500}>

  <Rectangle fill="green" />

  <Rectangle
    x1={100} x2={400}
    y1={100} y2={400}
    fill="red" 
  />

  <Section
    x1={100} x2={400}
    y1={100} y2={400}
    scaleX={scaleLinear().domain(domainX)}
    scaleY={scaleLinear().domain(domainY)}
  >

    {#each points as point}
      <Point
        x={point[0]}
        y={point[1]}
        fill="white"
        radius={7}
      />
    {/each}

  </Section>

</Graphic>
<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Rectangle, Point } from '../sveg'

  let x1 = 0
  let x2 = 10
  let y1 = 0
  let y2 = 10
  let radius = 7

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

  const log = console.log

  function resetValues () {
    x1 = 0
    x2 = 10
    y1 = 0
    y2 = 10
    radius = 7
  }

  // how to scale increase/decrease in radius
  // how to scale other props?
  const handleZoom = {
    delta: 'wheelDelta',
    zoomFactor: 0.3,
    maxZoom: 2,
    minZoom: 1,
    callback: function (id, event) {
      x1 = x1 - event[this.delta] * this.zoomFactor
      x2 = x2 + event[this.delta] * this.zoomFactor
      y1 = y1 - event[this.delta] * this.zoomFactor
      y2 = y2 + event[this.delta] * this.zoomFactor
      radius = radius - event[this.delta] * this.zoomFactor >= 0.5 ? radius - event[this.delta] * this.zoomFactor : 0.5
    }
  };

  const test = Object.create(handleZoom);
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

<div>
  <button on:click={() => resetValues()}>Reset</button>
</div>

<Graphic width={500} height={500}>

  <Rectangle fill="green" />

  <Rectangle
    x1={100} x2={400}
    y1={100} y2={400}
    fill="orange" 
  />

  <Section
    x1={100} x2={400}
    y1={100} y2={400}
    scaleX={scaleLinear().domain(domainX)}
    scaleY={scaleLinear().domain(domainY)}
    onWheel={ Object.create(handleZoom) }
  >

    {#each points as point}
      <Point
        x={point[0]}
        y={point[1]}
        fill="white"
        radius={radius}
      />
    {/each}

  </Section>

</Graphic>
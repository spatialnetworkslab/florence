<script>
	import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, Point } from '../../../../../src/'

  let height = 500
  let transformation = 'identity'
  let duration = 2000

  const log = console.log

  let background = 'pink'

  let bigPoint = { x: 250, y: 250 }
  let dragPoint

  function onMousedrag (event) {
    if (event.dragType === 'start') {
      dragPoint = event.localCoordinates
    }

    if (event.dragType === 'drag') {
      dragPoint = event.localCoordinates
    }

    if (event.dragType === 'end') {
      bigPoint = dragPoint
      dragPoint = undefined
    }
  }
</script>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
  </select>
</div>

<div>
  <label for="duration">Transition time</label>
  <input
    name="duration"
    type="range"
    min="100"
    max="5000"
    bind:value={duration}
  />
</div>

<div>
  <Graphic
    width={500}
    {height}
    scaleX={scaleLinear().domain([0, 500])}
    scaleY={scaleLinear().domain([0, 500])}
  >
    <Point
      x={bigPoint.x}
      y={bigPoint.y}
      fill={"red"}
      opacity={dragPoint ? 0 : 1}
      radius={10}
      {onMousedrag}
    />

    {#if dragPoint}
      <Point x={dragPoint.x} y={dragPoint.y} radius={10} fill={"red"} />
    {/if}
  </Graphic>
</div>

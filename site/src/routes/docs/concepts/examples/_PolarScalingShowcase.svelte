<script>
  import { Graphic, Rectangle, LineLayer, LabelLayer } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  export let flipY = false

  let transformation = 'identity'
</script>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
  </select>

  <label for="flipY">flipY:</label>
  <input name="flipY" type="checkbox" bind:checked={flipY} />
</div>

<Graphic 
  width={500}
  height={500}
  {transformation}
  backgroundColor="#b2ffb2"
  scaleX={scaleLinear().domain([0, 4])}
  scaleY={scaleLinear().domain([0, 4])}
  {flipY}
>

  <Rectangle fill="white" opacity={0.4} transition={2000} />

  <LineLayer 
    x={[[0, 0], [1, 1], [2, 2], [3, 3]]}
    y={[[0, 4], [0, 4], [0, 4], [0, 4]]}
    stroke={["red", "orange", "yellow" , "green"]}
    transition={2000}
  />

  <LabelLayer
    x={[0, 1, 2, 3]}
    y={[2, 2, 2, 2]}
    text={[0, 1, 2, 3]}
    transition={2000}
  />

</Graphic>
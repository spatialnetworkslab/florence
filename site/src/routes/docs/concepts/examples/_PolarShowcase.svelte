<script>
  import { Graphic, Rectangle, LineLayer, LabelLayer } from '@snlab/florence'

  export let flipY = false

  let transformation = 'identity'
</script>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
  </select>
</div>

<Graphic 
  width={500}
  height={500}
  {transformation}
  backgroundColor="#b2ffb2"
  {flipY}
>

  <Rectangle fill="white" opacity={0.4} />

  <LineLayer 
    x={[[0, 0], [0.25, 0.25], [0.5, 0.5], [0.75, 0.75]]}
    y={[[0, 1], [0, 1], [0, 1], [0, 1]]}
    stroke={["red", "orange", "yellow" , "green"]}
  />

  <LabelLayer
    x={[0, 0.25, 0.5, 0.75]}
    y={[0.5, 0.5, 0.5, 0.5]}
    text={[0, 0.25, 0.5, 0.75]}
  />

</Graphic>
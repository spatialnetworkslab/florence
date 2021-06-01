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
    x={[[0, 0], [125, 125], [250, 250], [375, 375]]}
    y={[[0, 500], [0, 500], [0, 500], [0, 500]]}
    stroke={["red", "orange", "yellow" , "green"]}
  />

  <LabelLayer
    x={[0, 125, 250, 375]}
    y={[250, 250, 250, 250]}
    text={[0, 125, 250, 375]}
  />

</Graphic>
<script>
  import { getContext } from 'svelte'
  import { generatePixelCoordinates } from '../../../rendering/point'

  export let x
  export let y

  export let radius = 3
  export let fill = 'black'

  $: parentCoordinateContext = getContext(coordinateContextKey)

  $: coordinates = { x, y }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)
</script>

<circle cx={pixelCoordinates.x} cy={pixelCoordinates.y} r={radius} {fill} />
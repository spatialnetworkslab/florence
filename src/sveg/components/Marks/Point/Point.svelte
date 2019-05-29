<script>
  import { getContext } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import { generatePixelCoordinates } from '../../../rendering/point'

  export let x
  export let y

  export let radius = 3
  export let fill = 'black'

  const parentCoordinateContext = getContext(coordinateContextKey)

  const coordinates = { x, y }
  const pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)
</script>

<circle cx={pixelCoordinates.x} cy={pixelCoordinates.y} r={radius} {fill} />
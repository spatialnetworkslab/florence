<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import { generatePixelCoordinates } from '../../../rendering/point'

  export let x
  export let y

  export let radius = 3
  export let fill = 'black'

  let parentCoordinateContext
  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  const coordinates = { x, y }
  const pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  onDestroy(unsubscribe)
</script>

<circle cx={pixelCoordinates.x} cy={pixelCoordinates.y} r={radius} {fill} />
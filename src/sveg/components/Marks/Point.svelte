<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey } from '../contextKeys.js'
  import { generatePixelCoordinates } from '../../rendering/point'

  export let x
  export let y

  export let radius = 3
  export let fill = 'black'

  let parentCoordinateContext

  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  $: coordinates = { x, y }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  $: cx = pixelCoordinates.x
  $: cy = pixelCoordinates.y

  onDestroy(unsubscribe)
</script>

<circle {cx} {cy} r={radius} {fill} />
<script>
  import { getContext } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import { generatePixelCoordinates, generatePath } from '../../../rendering/rectangle'


  export let x = undefined
  export let w = undefined
  export let y = undefined
  export let h = undefined

  $: parentCoordinateContext = getContext(coordinateContextKey)

  $: coordinates = { x, w, y, h }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)
  $: path = generatePath(points)
</script>

<path d={path} />

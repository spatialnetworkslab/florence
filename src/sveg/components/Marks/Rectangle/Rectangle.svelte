<script>
  import { getContext } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import { generatePixelCoordinates, generatePath } from '../../../rendering/rectangle'


  export let x = undefined
  export let w = undefined
  export let y = undefined
  export let h = undefined

  const parentCoordinateContext = getContext(coordinateContextKey)

  const coordinates = { x, w, y, h }
  const pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)
  const path = generatePath(pixelCoordinates)
</script>

<path d={path} />

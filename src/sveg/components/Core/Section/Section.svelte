<script>
  import { getContext, setContext } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import CoordinateContext from '../../../classes/CoordinateContext'
  import { generatePixelCoordinates } from '../../../rendering/rectangle'

  export let x = undefined
  export let w = undefined
  export let y = undefined
  export let h = undefined

  export let scaleX = undefined
  export let scaleY = undefined

  const parentCoordinateContext = getContext(coordinateContextKey)

  const coordinates = { x, w, y, h }
  const pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  const rangeX = [pixelCoordinates.x, pixelCoordinates.x + pixelCoordinates.w]
  const rangeY = [pixelCoordinates.y, pixelCoordinates.y + pixelCoordinates.h]

  const coordinateContext = new CoordinateContext({ rangeX, rangeY, scaleX, scaleY })
  
  setContext(coordinateContextKey, coordinateContext)
</script>

<g>
  <slot />
</g>
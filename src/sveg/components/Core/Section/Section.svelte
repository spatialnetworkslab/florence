<script>
  import { getContext, setContext } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import CoordinateContext from '../../../classes/CoordinateContext'
  import { generatePixelCoordinates } from './generatePixelCoordinates.js'

  export let x = undefined
  export let w = undefined
  export let y = undefined
  export let h = undefined

  export let scaleX = undefined
  export let scaleY = undefined

  $: parentCoordinateContext = getContext(coordinateContextKey)

  $: coordinates = { x, w, y, h }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  $: rangeX = [pixelCoordinates.x, pixelCoordinates.x + pixelCoordinates.w]
  $: rangeY = [pixelCoordinates.y, pixelCoordinates.y + pixelCoordinates.h]

  $: coordinateContext = new CoordinateContext({ rangeX, rangeY, scaleX, scaleY })
  
  setContext(coordinateContextKey, coordinateContext)
</script>

<g>
  <slot />
</g>
<script>
  import { getContext, setContext } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import CoordinateContext from '../../../classes/CoordinateContext'
  import generatePixelCoordinates from './generatePixelCoordinates.js'

  export let x = undefined
  export let w = undefined
  export let y = undefined
  export let h = undefined

  export let scaleX = undefined
  export let scaleY = undefined

  $: parentCoordinateContext = getContext(coordinateContextKey)
  $: pixelCoordinates = generatePixelCoordinates(x, w, y, h, parentCoordinateContext)

  $: rangeX = [pixelCoordinates.x, pixelCoordinates.x + pixelCoordinates.w]
  $: rangeY = [pixelCoordinates.y, pixelCoordinates.y + pixelCoordinates.h]

  // $: scales = parseScales(scaleX, scaleY, rangeX, rangeY)
   
  // function parseScales (scaleX, scaleY, rangeX, rangeY) {
  //   return {
  //     x: scaleX ? scaleX.copy().range(rangeX) : undefined,
  //     y: scaleY ? scaleY.copy().range(rangeY) : undefined
  //   }
  // }
</script>

<g>
  <slot />
</g>
<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey } from '../contextKeys.js'
  import { generatePixelCoordinates, generatePath } from '../../rendering/rectangle'


  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  let parentCoordinateContext
  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)
  $: path = generatePath(pixelCoordinates)

  onDestroy(unsubscribe)
</script>

<path d={path} />

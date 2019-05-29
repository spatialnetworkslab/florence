<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import { generatePixelCoordinates, generatePath } from '../../../rendering/rectangle'


  export let x = undefined
  export let w = undefined
  export let y = undefined
  export let h = undefined

  let parentCoordinateContext
  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  $: coordinates = { x, w, y, h }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)
  $: path = generatePath(pixelCoordinates)

  onDestroy(unsubscribe)
</script>

<path d={path} />

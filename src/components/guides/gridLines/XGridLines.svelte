<script>
  import { getContext } from 'svelte'
  import { LineLayer } from '../../../index.js'

  import { getTickPositions } from '../Axes/ticks.js'
  import { getCoordinatesXRaster } from './getCoordinates.js'
  
  export let scale = undefined
  export let count = 10
  export let extra = false
  export let values = undefined
  export let width = 0.25
  export let color = 'black'
  export let opacity = 1

  // Contexts
  const section = getContext('section')

  // Make sure not polar
  $: {
    if ($section.coordinateSystem) {
      throw new Error('Cannot use grid lines with alternative coordinate systems (for now)')
    }
  }

  // Scale
  $: scaleX = scale
    ? scale.copy().range($section.scaleX.range())
    : $section.scaleX

  // Ticks
  $: positions = getTickPositions(
    values,
    scaleX,
    count,
    extra,
    $section.zoomIdentity 
      ? { t: $section.zoomIdentity.x, k: $section.zoomIdentity.kx }
      : undefined
  )

  $: coordinates = getCoordinatesXRaster(
    positions,
    scaleX,
    $section
  )
</script>

<LineLayer 
  {...coordinates}
  strokeWidth={width}
  opacity={opacity}
  stroke={color}
/>
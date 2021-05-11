<script>
  import { getContext } from 'svelte'
  import { LineLayer } from '../../../index.js'

  import { getTickPositions } from '../axes/ticks.js'
  import { getCoordinatesYRaster } from './getCoordinates.js'
  
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

  // Ticks
  $: positions = getTickPositions(
    values,
    $section.directScales.y,
    count,
    extra,
    $section.zoomIdentity 
      ? { t: $section.zoomIdentity.y, k: $section.zoomIdentity.ky }
      : undefined
  )

  $: coordinates = getCoordinatesYRaster(positions)
</script>

<LineLayer 
  {...coordinates}
  strokeWidth={width}
  opacity={opacity}
  stroke={color}
/>

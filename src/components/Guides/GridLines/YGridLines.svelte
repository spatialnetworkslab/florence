<script>
  import { LineLayer } from '../../../index.js'
  import * as SectionContext from '../../Core/Section/SectionContext'

  import { getTickPositions } from '../Axes/ticks.js'
  import { getCoordinatesYRaster } from './getCoordinates.js'
  
  export let scale = undefined
  export let count = 10
  export let extra = false
  export let values = undefined
  export let width = 0.25
  export let color = 'black'
  export let opacity = 1
  export let transition = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()

  // Make sure not polar
  $: {
    if ($sectionContext.transformation === 'polar') {
      throw new Error('Rasters do\'nt work with polar coordinates (for now)')
    }
  }

  // Scale
  $: scaleY = scale
    ? scale.copy().range($sectionContext.rangeY)
    : $sectionContext.scaleY

  // Ticks
  $: positions = getTickPositions(
    values,
    scaleY,
    count,
    extra,
    $sectionContext.zoomIdentity 
      ? { t: $sectionContext.zoomIdentity.y, k: $sectionContext.zoomIdentity.ky }
      : undefined
  )

  $: coordinates = getCoordinatesYRaster(
    positions,
    scaleY,
    $sectionContext
  )
</script>

<g class="y-grid-lines">
    
  <LineLayer 
    {...coordinates}
    strokeWidth={width}
    opacity={opacity}
    stroke={color}
    {transition}
  />

</g>

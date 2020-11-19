<script>
  import { LineLayer } from '../../../index.js'
  import * as SectionContext from '../../Core/Section/SectionContext'

  import { getTickPositions } from '../Axes/ticks.js'
  import { getCoordinatesXRaster } from './getCoordinates.js'
  
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
  $: scaleX = scale
    ? scale.copy().range($sectionContext.rangeX)
    : $sectionContext.scaleX

  // Ticks
  $: positions = getTickPositions(
    values,
    scaleX,
    count,
    extra,
    $sectionContext.zoomIdentity 
      ? { t: $sectionContext.zoomIdentity.x, k: $sectionContext.zoomIdentity.kx }
      : undefined
  )

  $: coordinates = getCoordinatesXRaster(
    positions,
    scaleX,
    $sectionContext
  )
</script>

<g class="x-raster">
    
  <LineLayer 
    {...coordinates}
    strokeWidth={width}
    opacity={opacity}
    stroke={color}
    {transition}
  />

</g>

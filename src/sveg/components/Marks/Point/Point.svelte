<script>
  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import scaleCoordinates from './scaleCoordinates.js'
  import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  // Convert coordinates
  $: scaledCoordinates = scaleCoordinates({ x, y }, $sectionContext)
  $: transformedCoordinates = applyCoordinateTransformation(
    [scaledCoordinates.x, scaledCoordinates.y], 
    $coordinateTransformationContext
  )

  // Aesthetics
  // TODO: fix this shit
  $: aesthetics = {
    x: transformedCoordinates[0],
    y: transformedCoordinates[1],
    radius,
    fill
  }
</script>

{#if $graphicContext.output() === 'svg'}

  <circle 
    cx={aesthetics.x} 
    cy={aesthetics.y} 
    r={aesthetics.radius} 
    fill={aesthetics.fill} 
  />

{/if}
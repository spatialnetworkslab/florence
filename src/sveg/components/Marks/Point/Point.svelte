<script>
  import * as GraphicContext from '../../Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import scaleCoordinates from './scaleCoordinates.js'
  import transformCoordinates from './transformCoordinates.js'

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
  $: transformedCoordinates = transformCoordinates(scaledCoordinates, $coordinateTransformationContext)

  // Aesthetics
  // TODO: make this shit reactive
  $: aesthetics = {
    x: transformedCoordinates.x,
    y: transformedCoordinates.y,
    radius,
    fill
  }


</script>

{#if $graphicContext.output() === 'svg'}

  <circle 
    cx={aesthetics.cx} 
    cy={aesthetics.cy} 
    r={aesthetics.radius} 
    fill={aesthetics.fill} 
  />

{/if}
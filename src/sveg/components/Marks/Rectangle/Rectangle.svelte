<script>
  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { scaleCoordinates, createCornerPoints } from './scaleCoordinates.js'
  import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'
  import generatePath from '../utils/generatePath.js'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let fill = 'black'
  export let transition = undefined
  export let interpolate = true

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  // Convert coordinates
  $: scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
  $: cornerPoints = createCornerPoints(scaledCoordinates)
  $: transformedPoints = applyCoordinateTransformation(
    cornerPoints, 
    $coordinateTransformationContext,
    interpolate
  )

  // Aesthetics
  // TODO: fix this shit
  $: aesthetics = {
    points: transformedPoints,
    fill
  }
</script>

{#if $graphicContext.output() === 'svg'}

  <path 
    d={generatePath(aesthetics.points)} 
    fill={aesthetics.fill} 
  />

{/if}
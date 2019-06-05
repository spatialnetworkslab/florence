<script>
  import { beforeUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { scaleCoordinates, createCornerPoints } from './scaleCoordinates.js'
  import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'
  
  import { createTransitionableAesthetic, createOptions } from '../utils/transitions'
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
  let scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
  let cornerPoints = createCornerPoints(scaledCoordinates)
  let transformedPoints = applyCoordinateTransformation(
    cornerPoints, 
    $coordinateTransformationContext,
    interpolate
  )

  // Aesthetics
  let aes_points = createTransitionableAesthetic('points', transformedPoints, transition)
  let aes_fill = createTransitionableAesthetic('fill', fill, transition)

  $: {
    let scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    let cornerPoints = createCornerPoints(scaledCoordinates)
    let transformedPoints = applyCoordinateTransformation(
      cornerPoints, 
      $coordinateTransformationContext,
      interpolate
    )

    aes_points.set(transformedPoints)
  }

  $: {
    aes_fill.set(fill)
  }

  beforeUpdate(() => {
    aes_points.update(_ => _, createOptions('points', transition))
    aes_fill.update(_ => _, createOptions('fill', transition))
  })
</script>

{#if $graphicContext.output() === 'svg'}

  <path 
    d={generatePath($aes_points)} 
    fill={$aes_fill} 
  />

{/if}
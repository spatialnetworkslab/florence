<script>
  import { beforeUpdate, afterUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinatesLayer } from './generateCoordinates.js'
  import { createTransitionableAesthetic, transitionsEqual } from '../utils/transitions'
  import { getNPoints } from './layerUtils.js'
  import { generatePropArray } from '../utils/generatePropArray.js'

  let initPhase = true
  const initDone = () => !initPhase

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

  let length = getNPoints(x, y)

  // Convert coordinate arrays
  let { xArray, yArray } = generateCoordinatesLayer(
    { x, y }, $sectionContext, $coordinateTransformationContext, length
  )

  // Generate other prop arrays
  let radiusArray = generatePropArray(radius, length)
  let fillArray = generatePropArray(fill, length)
</script>

{#if $graphicContext.output() === 'svg'}

  {#each xArray as _, i}

    <circle 
      cx={xArray[i]} 
      cy={yArray[i]} 
      r={radiusArray[i]} 
      fill={fillArray[i]} 
    />

  {/each}

{/if}
<script>
  import { getContext, setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey } from '../contextKeys.js'
  import CoordinateContext from '../../classes/CoordinateContext'
  import { generatePixelCoordinates } from '../../rendering/rectangle'
  import { getCells, getNames, mergeNameSpecs } from './utils/gridUtils.js'

  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  export let scaleX = undefined
  export let scaleY = undefined

  export let gridTemplateRows = [0]
  export let gridTemplateColumns

  export let gridTemplateAreas

  let parentCoordinateContext

  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  $: allCells = getCells(gridTemplateRows, pixelCoordinates)

  $: console.log(allCells)

  $: allNames = getNames(gridTemplateRows)

  $: console.log(allNames)

  $: allSpecs = mergeNameSpecs(allNames, allCells)

  $: console.log(allSpecs)

</script>

<g>
  <slot generatedCells={ allSpecs } />
</g>
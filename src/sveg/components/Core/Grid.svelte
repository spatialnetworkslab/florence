<script>
  import { getContext, setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey } from '../contextKeys.js'
  import CoordinateContext from '../../classes/CoordinateContext'
  import { generatePixelCoordinates } from '../../rendering/rectangle'
  import { getAllCells, getNames, mergeNameSpecs } from './utils/gridUtils.js'

  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  export let scaleX = undefined
  export let scaleY = undefined

  export let gridTemplateRows = 1
  export let gridTemplateColumns = 1

  export let gridRowGap = 0
  export let gridColumnGap = 0

  export let gridTemplateAreas = undefined

  let parentCoordinateContext

  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  let allCells
  let allNames

  $: allCells = getAllCells(gridTemplateRows, gridTemplateColumns, pixelCoordinates)

  $: allNames = getNames(gridTemplateAreas, allCells)

  $: allSpecs = mergeNameSpecs(allNames, allCells)

</script>

<g>
  <slot generatedCells={ allSpecs } />
</g>
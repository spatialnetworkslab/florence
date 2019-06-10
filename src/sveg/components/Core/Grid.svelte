<script>
  import { getContext, setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey } from '../contextKeys.js'
  import CoordinateContext from '../../classes/CoordinateContext'
  import { generatePixelCoordinates } from '../../rendering/rectangle'
  import { getAllCells, getNames, mergeNameSpecs } from './utils/gridUtils.js'
  import { printGrid } from './utils/viewGrid.js'

  // Position of grid cells
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  // Scales
  export let scaleX = undefined
  export let scaleY = undefined

  // Grid specs
  export let gridTemplateRows = 1
  export let gridTemplateColumns = 1
  export let gridRowGap = 0
  export let gridColumnGap = 0
  export let gridTemplateAreas = undefined

  // Option to console log grid layout
  // This is an expensive operation
  export let viewGridTemplate = false

  // Option to console log rows in cols in grid
  // This is a less expensive alternative
  export let viewGridShape = false

  let parentCoordinateContext

  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  let allCells
  let allNames

  // Get cells
  $: [allCells, rowSizes, colSizes, numRows, numCols] = getAllCells(gridTemplateRows, gridTemplateColumns, gridRowGap, gridColumnGap, pixelCoordinates)

  // Console log grid specification as necessary
  $: if (viewGridTemplate) { printGrid( rowSizes, colSizes ) }
  $: if (viewGridShape) { console.log('rows:', numRows, ' columns:', numCols) }

  // Get named cells
  $: allSpecs = mergeNameSpecs(gridTemplateAreas, allCells, numCols)

</script>

<g>
  <slot generatedCells={ allSpecs } />
</g>
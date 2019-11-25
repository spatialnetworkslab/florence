<script>
  import { beforeUpdate } from 'svelte'
  import * as SectionContext from '../Section/SectionContext'
  import * as CoordinateTransformationContext from '../Section/CoordinateTransformationContext'

  import { scaleCoordinates } from '../../Marks/Rectangle/createCoordSysGeometry.js'
  import { getAllCells, mergeNameSpecs } from './gridUtils.js'
  import { printGrid } from './viewGrid.js'

  // Props
  export let x1
  export let x2
  export let y1
  export let y2
  export let rows = 1
  export let columns = 1
  export let rowGap = 0
  export let columnGap = 0
  export let areaNames
  export let viewGridTemplate = false // Option to console log grid layout
  export let viewGridShape = false // Option to console log rows in cols in grid

  // Contexts
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const sectionContext = SectionContext.subscribe()

  let scaledCoordinates
  $: scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)

  let allCells
  let allNames

  // Get cells
  $: [allCells, rowSizes, colSizes, numRows, numCols] = getAllCells(rows, columns, rowGap, columnGap, scaledCoordinates)

  // Console log grid specification as necessary
  $: if (viewGridTemplate) { printGrid(rowSizes, colSizes) }
  $: if (viewGridShape) { console.log('rows:', numRows, ' columns:', numCols) }

  // Get named cells
  $: allSpecs = mergeNameSpecs(areaNames, allCells, numCols)

  beforeUpdate(() => {
    CoordinateTransformationContext.ensureNotParent($coordinateTransformationContext)
  })
</script>

<g>
  <slot cells={allSpecs} />
</g>
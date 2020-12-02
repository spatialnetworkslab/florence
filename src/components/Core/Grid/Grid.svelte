<script>
  import * as SectionContext from '../Section/SectionContext'

  import { getPixelCoordinates } from '../Section/getPixelCoordinates.js'
  import { getAspectRatio, getNRowsAndColumns } from './getNRowsAndColumns.js'
  import { getAllCells, mergeNameSpecs } from './gridUtils.js'
  import { printGrid } from './viewGrid.js'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let rows = undefined
  export let columns = undefined
  export let rowGap = 0
  export let columnGap = 0
  export let names
  export let viewGridTemplate = false // Option to console log grid layout
  export let viewGridShape = false // Option to console log rows in cols in grid

  // Contexts
  const sectionContext = SectionContext.subscribe()

  let pixelCoordinates = getPixelCoordinates({ x1, x2, y1, y2 }, $sectionContext)
  $: pixelCoordinates = getPixelCoordinates({ x1, x2, y1, y2 }, $sectionContext)

  $: aspectRatio = getAspectRatio(pixelCoordinates)

  let nrows
  let ncolumns

  $: {
    let _ = getNRowsAndColumns(rows, columns, names.length, aspectRatio);
    nrows = _.nrows
    ncolumns = _.ncolumns

    if (nrows * ncolumns < names.length) {
      throw new Error(`Not enough rows (${nrows}) and columns (${ncolumns}) for number of cells (${names.length})`)
    }
  }
  // Get cells
  $: [allCells, rowSizes, colSizes, numRows, numCols] = getAllCells(nrows, ncolumns, rowGap, columnGap, pixelCoordinates)

  // Console log grid specification as necessary
  $: if (viewGridTemplate) { printGrid(rowSizes, colSizes) }
  $: if (viewGridShape) { console.log('rows:', numRows, ' columns:', numCols) }

  // Get named cells
  $: allSpecs = mergeNameSpecs(names, allCells, numCols)
</script>

<g>
  <slot cells={allSpecs} />
</g>

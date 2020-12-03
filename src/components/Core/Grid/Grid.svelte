<script>
  import * as SectionContext from '../Section/SectionContext'
  import Section from '../Section/Section.svelte'
  import { getPixelCoordinates } from '../Section/getPixelCoordinates.js'
  import { getAspectRatio, getNRowsAndColumns } from './getNRowsAndColumns.js'
  import { getCells, applyPadding, nameCells } from './cells.js'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  export let names
  export let rows = undefined
  export let columns = undefined
  export let padding = undefined
  export let cellPadding = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()

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

  $: pixelCoordinates = getPixelCoordinates({ x1, x2, y1, y2 }, $sectionContext)
  $: cells = getCells(applyPadding(pixelCoordinates, padding), nrows, ncolumns, cellPadding)
  $: namedCells = nameCells(cells, names)
</script>

<!-- <g>
  <slot cells={allSpecs} />
</g> -->

<Section {x1} {x2} {y1} {y2}>

  <slot cells={namedCells} />

</Section>
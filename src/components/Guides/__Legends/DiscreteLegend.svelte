<script>
  import { Section, Grid, Rectangle, Label } from '../../../index.js'
  import { getSectionCoordinates, getLabelCoordinates } from './legend.js'
  import { getRectangleCoordinates } from './discreteLegend.js'

  // Positioning
  export let x1
  export let x2
  export let y1
  export let y2
  export let rowGap = 5
  export let xDivider = 0.5
  export let yDivider = 0.2

  // Colors and labels
  export let colors
  export let labels

  // Color swatch settings
  // TODO

  // Label settings
  export let labelFontSize = undefined

  // Other
  export let transition = undefined

  $: sectionCoordinates = getSectionCoordinates(x1, x2, y1, y2)
</script>

<Section {...sectionCoordinates} scaleX={[0, 1]} scaleY={[0, 1]}>

  <!-- Slot for title and other stuff -->
  <slot />

  <!-- Color swatches -->
  <Grid 
    x1={0} x2={xDivider} y1={yDivider} y2={1}
    names={colors}
    columns={1}
    let:cells
    {rowGap}
  >

    {#each colors as color}

      <Rectangle
        {...getRectangleCoordinates(cells[color])}
        fill={color}
        {transition}
      />

    {/each}
  
  </Grid>

  <!-- Labels -->
  <Grid 
    x1={xDivider} x2={1} y1={yDivider} y2={1}
    names={labels}
    columns={1}
    let:cells
  >

    {#each labels as label}

      <Label
        {...getLabelCoordinates(cells[label])}
        text={label}
        fontSize={labelFontSize}
        anchorPoint={'l'}
        {transition}
      />

    {/each}
  
  </Grid>

</Section>
<script>
  import { Section, Grid, Rectangle, Label } from '../../../index.js'
  import { 
    getSectionCoordinates,
    getRectangleCoordinates,
    getLabelCoordinates
  } from './discreteColorLegendUtils.js'

  export let x1
  export let x2
  export let y1
  export let y2

  export let colors
  export let labels

  export let gap = 5
  export let horizontalDivider = 0.2
  export let verticalDivider = 0.5
  export let labelFontSize = undefined

  $: sectionCoordinates = getSectionCoordinates(x1, x2, y1, y2)
</script>

<Section {...sectionCoordinates} scaleX={[0, 1]} scaleY={[0, 1]}>

  <!-- Slot for title -->
  <slot />

  <!-- Color swatches -->
  <Grid 
    x1={0} x2={verticalDivider} y1={horizontalDivider} y2={1}
    names={colors}
    columns={1}
    let:cells
    rowGap={gap}
  >

    {#each colors as color}

      <Rectangle
        {...getRectangleCoordinates(cells[color])}
        fill={color}
      />

    {/each}
  
  </Grid>

  <!-- Labels -->
  <Grid 
    x1={horizontalDivider} x2={1} y1={horizontalDivider} y2={1}
    names={labels}
    columns={1}
    let:cells
    rowGap={gap}
  >

    {#each labels as label}

      <Label
        {...getLabelCoordinates(cells[label])}
        text={label}
        fontSize={labelFontSize}
        anchorPoint={'l'}
      />

    {/each}
  
  </Grid>

</Section>
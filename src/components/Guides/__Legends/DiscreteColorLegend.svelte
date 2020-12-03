<script>
  import { Section, Grid, Rectangle, Label } from '../../../index.js'

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

  $: sectionCoordinates = {
    x1: Math.min(x1, x2),
    x2: Math.max(x1, x2),
    y1: Math.min(y1, y2),
    y2: Math.max(y1, y2)
  }

  function getRectangleCoordinates ({ x1, x2, y1, y2 }) {
    const height = Math.abs(y2 - y1)
    const width = Math.abs(x2 - x1)

    if (width > height) {
      const centered = center(x1, x2, width, height)

      return {
        x1: centered[0],
        x2: centered[1],
        y1,
        y2
      }
    } 
    
    if (width <= height) {
      const centered = center(y1, y2, height, width)

      return {
        x1,
        x2,
        y1: centered[0],
        y2: centered[1]
      }
    }
  }

  function center (lower, upper, bigWidth, smallWidth) {
    const space = (bigWidth - smallWidth) / 2
    return [space + lower, upper - space]
  }

  function getLabelCoordinates ({ x1, x2, y1, y2 }) {
    return {
      x: x1,
      y: (y2 + y1) / 2
    }
  }
</script>

<Section {...sectionCoordinates} scaleX={[0, 1]} scaleY={[0, 1]}>

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
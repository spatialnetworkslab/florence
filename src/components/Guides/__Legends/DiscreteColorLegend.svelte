<script>
  import { Section, Grid, Rectangle, Label } from '../../../index.js'

  export let x1
  export let x2
  export let y1
  export let y2
  
  export let colors
  export let labels

  // export let orientation = 'horizontal'

  function getLabelCoordinates ({ x1, x2, y1, y2 }) {
    return {
      x: x1,
      y: Math.abs(y2 + y1) / 2
    }
  }
</script>

<Section {x1} {x2} {y1} {y2} scaleX={[0, 1]} scaleY={[0, 1]}>

  <!-- Color swatches -->
  <Grid 
    x1={0} x2={0.5} y1={0.2} y2={1}
    names={colors}
    columns={1}
    let:cells
  >

    {#each colors as color}

      <Rectangle
        {...cells[color]}
        fill={color}
      />

    {/each}
  
  </Grid>

  <!-- Labels -->
  <Grid 
    x1={0.5} x2={1} y1={0.2} y2={1}
    names={labels}
    columns={1}
    let:cells
  >

    {#each labels as label}

      <Label
        {...getLabelCoordinates(cells[label])}
        text={label}
        anchorPoint={'l'}
      />

    {/each}
  
  </Grid>

</Section>
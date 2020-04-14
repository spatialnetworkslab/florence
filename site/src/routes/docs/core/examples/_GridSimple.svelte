<script>
  import { Graphic, Section, Grid } from '@snlab/florence'

  const colors = ['red', 'blue', 'green', 'orange', 'yellow', 'purple']

  let columns = 2
  $: rows = Math.ceil(colors.length / columns)

  const width = 200
  const height = 200
</script>

<div>
  <label for="cols-slider">Columns:</label>
  <input type="range" min="1" max="3" bind:value={columns} name="cols-slider" />
</div>

<Graphic {width} {height}>
  <Grid
      {columns}
      {rows}
      areaNames={colors}
      let:cells
  >
      {#each colors as color}
          <Section {...cells[color]} backgroundColor={color}>
          </Section>
      {/each}
  </Grid>
</Graphic>


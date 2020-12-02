<script>
  import { Graphic, Section, Grid } from '@snlab/florence'

  const colors = ['red', 'blue', 'green', 'orange', 'yellow', 'purple']

  let columns = 2
  $: rows = Math.ceil(colors.length / columns)
</script>

<div>
  <label for="cols-slider">Columns:</label>
  <input type="range" min="1" max="3" bind:value={columns} name="cols-slider" />
</div>

<Graphic width={200} height={200}>

  <Grid {columns} {rows} names={colors} let:cells>

    {#each colors as color}
      
      <Section {...cells[color]} backgroundColor={color}></Section>

    {/each}

  </Grid>

</Graphic>

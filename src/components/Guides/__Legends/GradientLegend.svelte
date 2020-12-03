<script context="module">
  let idCounter = 0
  function getId () {
    return 'gradient' + idCounter++
  }
</script>

<script>
  import { Section, Grid, Rectangle, Label } from '../../../index.js'
  import Gradient from './Gradient.svelte'
  import { getSectionCoordinates, getLabelCoordinates } from './legend.js'
  import { getRectangleCoordinates } from './gradientLegend.js'

  export let x1
  export let x2
  export let y1
  export let y2

  export let colors
  export let labels

  export let xDivider = 0.5
  export let yDivider = 0.2
  export let rectangleWidth = 0.25
  export let labelFontSize = undefined

  const gradientId = getId()
  
  $: sectionCoordinates = getSectionCoordinates(x1, x2, y1, y2)

  $: rectangleCoordinates = getRectangleCoordinates(
    xDivider,
    yDivider,
    rectangleWidth,
    labels.length
  )
</script>

<Gradient
  {gradientId}
  {colors}
/>

<Section {...sectionCoordinates} scaleX={[0, 1]} scaleY={[0, 1]}>

  <!-- Slot for title and other stuff -->
  <slot />

  <!-- Color gradient -->
  <Rectangle
    {...rectangleCoordinates}
    fill={`url(#${gradientId})`}
  />

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
    />

  {/each}
  
  </Grid>

</Section>

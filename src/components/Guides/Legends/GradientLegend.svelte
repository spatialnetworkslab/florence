<script context="module">
  let idCounter = 0
  function getId () {
    return 'gradient' + idCounter++
  }
</script>

<script>
  import { Section, Rectangle, Label } from '../../../index.js'
  import Gradient from './Gradient.svelte'
  import { getSectionCoordinates, getLabelCoordinates } from './legend.js'
  import { getRectangleCoordinates } from './gradientLegend.js'

  // Positioning
  export let x1
  export let x2
  export let y1
  export let y2
  export let gap = 5
  export let xDivider = 0.3
  export let yDivider = 0.2

  // Colors and labels
  export let colors
  export let labels

  // Color gradient settings
  export let stroke = 'none'
  export let strokeWidth = 2

  // Label settings
  export let labelFont = 'Helvetica'
  export let labelFontSize = 10
  export let labelFontWeight = 'normal'
  export let labelOpacity = 1
  export let labelColor = 'black'

  // Other
  export let transition = undefined

  const gradientId = getId()
  
  $: sectionCoordinates = getSectionCoordinates(x1, x2, y1, y2)

  $: rectangleCoordinates = getRectangleCoordinates(
    xDivider,
    yDivider,
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
  <Section
    {...rectangleCoordinates}
    padding={{ left: gap * 2, right: gap * 2, top: 0, bottom: 0 }}
  >

    <Rectangle
      fill={`url(#${gradientId})`}
      {stroke}
      {strokeWidth}
      {transition}
    />

  </Section>

  <!-- Labels -->
  <Grid 
    x1={xDivider} x2={1} y1={yDivider} y2={1}
    names={labels}
    columns={1}
    rowGap={gap}
    colGap={gap}
    let:cells
  >

  {#each labels as label}

    <Label
      {...getLabelCoordinates(cells[label])}
      text={label}
      anchorPoint={'l'}
      fontFamily={labelFont}
      fontSize={labelFontSize}
      fontWeight={labelFontWeight} 
      opacity={labelOpacity} 
      fill={labelColor}
      {transition}
    />

  {/each}
  
  </Grid>

</Section>

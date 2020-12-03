<script>
  import { Section, Rectangle, Label } from '../../../index.js'
  import { getSectionCoordinates, getLabelCoordinates } from './legend.js'
  import { getRectangleCoordinates } from './discreteLegend.js'

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

  // Color swatch settings
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

  $: sectionCoordinates = getSectionCoordinates(x1, x2, y1, y2)
</script>

<Section {...sectionCoordinates} scaleX={[0, 1]} scaleY={[0, 1]}>

  <!-- Slot for title and other stuff -->
  <slot />

  <!-- Color swatches -->
  {#each colors as color}

    <!-- <Rectangle
      {...getRectangleCoordinates(cells[color])}
      fill={color}
      {stroke}
      {strokeWidth}
      {transition}
    /> -->

  {/each}

  <!-- Labels -->
  {#each labels as label}

    <!-- <Label
      {...getLabelCoordinates(cells[label])}
      text={label}
      anchorPoint={'l'}
      fontFamily={labelFont}
      fontSize={labelFontSize}
      fontWeight={labelFontWeight} 
      opacity={labelOpacity} 
      fill={labelColor}
      {transition}
    /> -->

  {/each}

</Section>
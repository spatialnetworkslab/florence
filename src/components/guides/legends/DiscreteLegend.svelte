<script>
  import { Section, Grid, Rectangle, Label } from '../../../index.js'
  import { parseAesthetic } from './legend.js'

  // Positioning
  export let x1
  export let x2
  export let y1
  export let y2
  export let xDivider = 0.3
  export let yDivider = 0.2
  export let padding = 1
  export let cellPadding = 2
  
  // Aesthetics and labels
  export let labels
  export let fill
  export let opacity = 1

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
  export let clip = 'outer'
  export let backgroundColor = undefined

  $: fills = parseAesthetic(fill, labels.length)
  $: opacities = parseAesthetic(opacity, labels.length)

  $: {
    if (fills.length !== opacities.length) {
      throw new Error('Aesthetics and labels must all be of same length')
    }
  }
</script>

<Section {x1} {x2} {y1} {y2} {backgroundColor}>

  <!-- Slot for title and other stuff -->
  <slot />

  <!-- Color swatches -->
  <Grid 
    x2={xDivider} 
    y1={yDivider}
    numberOfCells={fills.length}
    columns={1}
    {padding}
    let:cells
  >

    {#each fills as fill, i}

      <Section
        {...cells[i]}
        padding={cellPadding}
      >

        <Rectangle
          {fill}
          fillOpacity={opacities[i]}
          {stroke}
          {strokeWidth}
          {clip}
        />

      </Section>

    {/each}
  
  </Grid>

  <!-- Labels -->
  <Grid 
    x1={xDivider}
    y1={yDivider}
    numberOfCells={labels.length}
    columns={1}
    {padding}
    let:cells
  >

    {#each labels as label, i}

      <Section {...cells[i]} padding={cellPadding}>

        <Label
          x={0}
          y={0.5}
          text={label}
          anchorPoint={'l'}
          fontFamily={labelFont}
          fontSize={labelFontSize}
          fontWeight={labelFontWeight} 
          opacity={labelOpacity} 
          fill={labelColor}
          {clip}
        />
        
      </Section>

    {/each}
  
  </Grid>

</Section>
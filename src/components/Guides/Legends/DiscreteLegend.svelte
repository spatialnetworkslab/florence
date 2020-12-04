<script>
  import { Section, Grid, Rectangle, Label } from '../../../index.js'
  import { getLabelCoordinates, parseAesthetic } from './legend.js'
  import { getRectangleCoordinates } from './discreteLegend.js'

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
  export let transition = undefined

  $: fills = parseAesthetic(fill, labels.length)
  $: opacities = parseAesthetic(opacity, labels.length)

  $: {
    if (fills.length !== opacities.length) {
      throw new Error('Aesthetics and labels must all be of same length')
    }
  }
</script>

<Section {x1} {x2} {y1} {y2} scaleX={[0, 1]} scaleY={[0, 1]}>

  <!-- Slot for title and other stuff -->
  <slot />

  <!-- Color swatches -->
  <Grid 
    x1={0} x2={xDivider} y1={yDivider} y2={1}
    names={fills}
    columns={1}
    {padding}
    {cellPadding}
    let:cells
  >

    {#each fills as fill, i}

      <Rectangle
        {...getRectangleCoordinates(cells[fill])}
        {fill}
        fillOpacity={opacities[i]}
        {stroke}
        {strokeWidth}
        {transition}
      />

    {/each}
  
  </Grid>

  <!-- Labels -->
  <Grid 
    x1={xDivider} x2={1} y1={yDivider} y2={1}
    names={labels}
    columns={1}
    {padding}
    {cellPadding}
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
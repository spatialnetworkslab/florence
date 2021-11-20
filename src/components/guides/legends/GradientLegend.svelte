<script context="module">
  let idCounter = 0
  function getId () {
    return 'gradient' + idCounter++
  }
</script>

<script>
  import { getContext } from 'svelte'
  import { Section, Grid, Rectangle, Label } from '../../../index.js'
  import Gradient from './Gradient.svelte'
  import { parseAesthetic } from './legend.js'
  import { getRectangleCoordinates } from './gradientLegend.js'

  // Positioning
  export let x1
  export let x2
  export let y1
  export let y2
  export let xDivider = 0.3
  export let yDivider = 0.2
  export let padding = 1

  // Aesthetics and labels
  export let labels
  export let fill
  export let opacity = 1

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
  export let clip = 'outer'
  export let backgroundColor = undefined

  const { renderer } = getContext('graphic')
  
  if (renderer !== 'svg') {
    throw new Error('GradientLegend only works with svg (for now)')
  }

  const gradientId = getId()

  $: rectangleCoordinates = getRectangleCoordinates(
    xDivider,
    yDivider,
    labels.length
  )

  $: fills = parseAesthetic(fill, labels.length)
  $: opacities = parseAesthetic(opacity, labels.length)

  $: {
    if (fills.length !== opacities.length) {
      throw new Error('Aesthetics and labels must all be of same length')
    }
  }
</script>

<Gradient {gradientId} {fills} {opacities} />

<Section {x1} {x2} {y1} {y2} {backgroundColor}>
  <!-- Slot for title and other stuff -->
  <slot />

  <!-- Color gradient -->
  <Section {...rectangleCoordinates} {padding}>
    <Rectangle fill={`url(#${gradientId})`} {stroke} {strokeWidth} {clip} />
  </Section>

  <!-- Labels -->
  <Grid
    x1={xDivider}
    y1={yDivider}
    {padding}
    numberOfCells={labels.length}
    columns={1}
    let:cells
  >

    {#each labels as label, i}

      <Section {...cells[i]}>

        <Label
          x={0}
          y={0.5}
          text={label}
          anchorPoint={"l"}
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

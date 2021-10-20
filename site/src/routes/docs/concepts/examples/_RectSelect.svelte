<script>
  import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, Point, Rectangle } from '@snlab/florence'

  let section
  let makingSelection = false
  let selectionRectangle

  function onMousedown ({ screenCoordinates }) {
    section.resetSelectRectangle()

    makingSelection = true
    const { x, y } = screenCoordinates
    selectionRectangle = { x1: x, x2: x, y1: y, y2: y }

    section.selectRectangle(selectionRectangle)
  }

  function onMousemove ({ screenCoordinates }) {
    if (makingSelection) {
      const { x, y } = screenCoordinates
      selectionRectangle.x2 = x
      selectionRectangle.y2 = y

      section.updateSelectRectangle(selectionRectangle)
    }
  }

  function onMouseup () {
    if (makingSelection) makingSelection = false
  }

  let pointInSelection = false
</script>

<Graphic width={300} height={300} backgroundColor="#b2ffb2" scaleX={[0, 300]} scaleY={[0, 300]}>

  <Section
    bind:this={section}
    padding={30}
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
    {onMousedown}
    {onMousemove}
    {onMouseup}
  >

    <Point 
      x={5} y={5} radius={7}
      onSelect={() => { pointInSelection = true }}
      onDeselect={() => { pointInSelection = false }}
    />
  
  </Section>

  <!-- Selection rectangle -->
  {#if selectionRectangle}

    <Rectangle 
      {...selectionRectangle} 
      fill="red" opacity={0.2}
    />

  {/if}

</Graphic>

<h1 style="color: blue;">{ pointInSelection ? 'Point in selection!' : 'Point not in selection...' }</h1>

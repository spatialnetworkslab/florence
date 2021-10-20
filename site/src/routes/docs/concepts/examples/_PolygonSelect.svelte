<script>
  import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, Point, Polygon } from '@snlab/florence'

  let section
  let selecting = false
  let selectionPolygon

  function onMousedown ({ screenCoordinates }) {
    section.resetSelectPolygon()
    selectionPolygon = undefined

    section.startSelectPolygon(screenCoordinates)
    selecting = true
  }

  function onMousemove ({ screenCoordinates }) {
    if (selecting) {
      section.addPointToSelectPolygon(screenCoordinates)
      selectionPolygon = section.getSelectPolygon()
    }
  }

  function onMouseup () {
    selecting = false
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

  <!-- Selection polygon -->
  {#if selectionPolygon}

    <Polygon 
      geometry={selectionPolygon} 
      fill="red" opacity={0.2}
    />

  {/if}

</Graphic>

<h1 style="color: blue;">{ pointInSelection ? 'Point in selection!' : 'Point not in selection...' }</h1>

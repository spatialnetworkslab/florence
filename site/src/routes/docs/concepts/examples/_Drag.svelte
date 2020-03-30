<script>
  import { Graphic, Section, Point } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  const points = new Array(5).fill(0).map(_ => ({
    x: Math.round(Math.random() * 10),
    y: Math.round(Math.random() * 10)
  }))

  $: center = {
    x: points.map(p => p.x).reduce((a, c) => a + c) / points.length,
    y: points.map(p => p.y).reduce((a, c) => a + c) / points.length
  }

  let blockReindexing

  function drag ({ dragType, localCoordinates }, index) {
    if (dragType === 'start') {
      blockReindexing = true
    }

    if (dragType === 'drag' && blockReindexing) {
      points[index] = localCoordinates
    }

    if (dragType === 'end') {
      blockReindexing = false
    }
  }
</script>

<Graphic width={300} height={300}>

  <Section 
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
    padding={20}
    {blockReindexing}
  >

    {#each points as point, i}
      <Point 
        {...point}
        radius={10}
        onMousedrag={e => drag(e, i)}
      />
    {/each}

    <Point {...center} radius={7} fill="blue" />
  
  </Section>

</Graphic>
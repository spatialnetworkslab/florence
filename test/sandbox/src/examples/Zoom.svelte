<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, PointLayer, Rectangle } from '../../../../'

  let x = 0
  let y = 0
  let k = 1

  let zoomIdentity = { x, y, k }

  let data = {
    x: [1, 2, 3, 1, 2, 3, 1, 2, 3],
    y: [1, 1, 1, 2, 2, 2, 3, 3, 3]
  }

  $: {
    zoomIdentity = { x, y, k }
  }
</script>

x:
<input type="range" min={-300} max={300} bind:value={x} /> <br />
y:
<input type="range" min={-300} max={300} bind:value={y} /> <br />
k:
<input type="range" min={0} max={3} step={0.1} bind:value={k} /> <br />

<Graphic width={500} height={500}>

  <Section 
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    {zoomIdentity}
  >

    <Rectangle fill="blue" opacity={0.3} />

    <!-- {#each data.x as _, i}

      <Point
        x={data.x[i]}
        y={data.y[i]}
        fill={'red'}
        radius={6}
      />

    {/each} -->
    
    <PointLayer 
      x={data.x} y={data.y}
      fill="red"
      radius={6}
    />
  
  </Section>

</Graphic>
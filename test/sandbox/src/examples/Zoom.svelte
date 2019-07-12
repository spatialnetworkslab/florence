<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Point, Rectangle } from '../../../../'

  let data = {
    x: [1, 2, 3, 1, 2, 3, 1, 2, 3],
    y: [1, 1, 1, 2, 2, 2, 3, 3, 3]
  }
</script>

<Graphic width={500} height={500}>

  <Section 
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    zoomIdentity={{ x: 0, y: 0, k: 1 }}
  >

    <Rectangle fill="blue" opacity={0.3} />

    {#each data.x as _, i}

      <Point
        x={data.x[i]}
        y={data.y[i]}
        fill={'red'}
        radius={6}
      />

    {/each}
  
  </Section>

</Graphic>
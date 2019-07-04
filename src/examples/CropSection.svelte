<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Rectangle, Point } from '../sveg'

  let domainX = [0, 10]
  let domainY = [0, 10]

  let points = [
    [0, 0],
    [0, 5],
    [0, 10],
    [5, 10],
    [10, 10],
    [10, 5],
    [10, 0],
    [5, 0],
    [5, 5],

    [2.5, 2.5],
    [2.5, 7.5],
    [7.5, 7.5],
    [7.5, 2.5]
  ]
</script>

<Graphic width={500} height={500}>

  <Rectangle fill="green" />

  <Rectangle
    x1={150} x2={350}
    y1={150} y2={350}
    fill="red" 
  />

  <Section
    x1={150} x2={350}
    y1={150} y2={350}
    scaleX={scaleLinear().domain(domainX)}
    scaleY={scaleLinear().domain(domainY)}
  >

    {#each points as point}
      <Point
        x={point[0]}
        y={point[1]}
        fill="white"
      />
    {/each}

  </Section>

</Graphic>
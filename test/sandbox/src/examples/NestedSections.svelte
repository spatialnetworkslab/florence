<script>
  import { scaleBand } from 'd3-scale'
  import { Graphic, Section, XAxis, Rectangle, x2 } from '../../../../src'

  const segments = ['iris', 'versicolor', 'virginica']
</script>

<Graphic width={600} height={430}>

  <Section
    scaleX={scaleBand().domain(segments)}
    padding={30}
    flipY
  >
    <Rectangle fill={'#c9f0ff'} />

    {#each segments as s}
      <Section
        x1={s}
        x2={x2(s)}
      >

        <Rectangle fill={'#dbbbf5'} stroke="black" />

      </Section>

    {/each}

    <XAxis baseLine={false} />

  </Section>
</Graphic>
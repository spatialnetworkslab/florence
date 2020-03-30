<script>
  import { scaleBand } from 'd3-scale'
  import { Graphic, Section, XAxis, Rectangle } from '../../../../src'

  const segments = ['iris', 'versicolor', 'virginica']
</script>

<Graphic width={600} height={430}>

  <Section
    scaleX={scaleBand().domain(segments)}
    padding={30}
    flipY
    backgroundColor='#c9f0ff'
  >
    {#each segments as s}
      <Section
        x1={s}
        x2={({ scaleX }) => scaleX(s) + scaleX.bandwidth()}
        backgroundColor='#dbbbf5'
      >
      </Section>

    {/each}

    <XAxis baseLine={false} />

  </Section>
</Graphic>
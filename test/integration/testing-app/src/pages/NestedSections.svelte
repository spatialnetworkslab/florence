<script>
  import { scaleBand } from 'd3-scale'
  import { Graphic, Section, XAxis } from '../../../../../src'

  const segments = ['iris', 'versicolor', 'virginica']
</script>

<Graphic width={600} height={430}>

  <Section
    scaleX={scaleBand().domain(segments).padding(0.1)}
    padding={30}
    flipY
    backgroundColor='#6e75a8'
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
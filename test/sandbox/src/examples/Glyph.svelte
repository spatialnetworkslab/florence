<script>
  import { Graphic, Glyph, RectangleLayer, polar, XAxis, YAxis } from '../../../../src'

  const glyphs = Array(100).fill(0).map((_, i) => {
    const size = 3 + Math.random() * 14 
    return {
      x: (i / 10) + Math.random() * 3,
      y: (i / 10) + Math.random() * 5,
      width: size,
      height: size
    }
  })
</script>

<Graphic width={500} height={500} scaleX={[0, 10]} scaleY={[0, 10]} flipY padding={30} renderer="canvas">

  {#each glyphs as glyph}
    <Glyph {...glyph} coordinates={polar()}>
    
      <RectangleLayer
        x1={[0, 0.2, 0.45, 0.8]}
        x2={[0.2, 0.45, 0.8, 1]}
        fill={['#DCF2B0', '#C2EABD', '#C7AC92', '#CD533B']}
      />

    </Glyph>
  {/each}

  <XAxis />
  <YAxis />

</Graphic>
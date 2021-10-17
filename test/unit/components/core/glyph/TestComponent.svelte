<script>
  import { Graphic, Glyph, Point } from '../../../../../src/index.js'

  export let graphic = {}
  export let glyph = {}
  export let point = {}

  $: _graphic = Object.assign({ width: 500, height: 500 }, graphic)
  $: _glyph = Object.assign({ x: 0.5, y: 0.5, width: 500, height: 500 }, glyph)
</script>

<Graphic {..._graphic}>
  <Glyph {..._glyph}>
    <Point {...point} />
  </Glyph>
</Graphic>

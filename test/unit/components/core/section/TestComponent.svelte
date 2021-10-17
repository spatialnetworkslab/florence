<script>
  import { Graphic, Section, Point } from '../../../../../src/index.js'

  export let graphic = {}
  export let section = {}
  export let point = {}

  $: _graphic = Object.assign({ width: 500, height: 500 }, graphic)
</script>

<Graphic {..._graphic}>
  <Section {...section}>
    <Point {...point} />
  </Section>
</Graphic>

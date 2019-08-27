<script>
  import { Graphic, Section, Point } from '../../../../../src'
  let padding = 0
</script>

<label for="padding-slider">Padding: {padding}</label>
<input type="range" min="0" max="50" bind:value={padding} name="padding-slider" />
<br />

<Graphic width={300} height={300}>

  <Section x1={50} x2={250} y1={50} y2={250} {padding}>
  
    <Point x={50} y={50} />
    <Point x={150} y={150} />
    <Point x={250} y={250} />

  </Section>

</Graphic>
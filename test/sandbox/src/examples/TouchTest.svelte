<script>
  import { scaleLinear } from 'd3-scale'
	import { 
    Graphic, Section, Label, Point, Rectangle, Line, Polygon, XAxis, YAxis
  } from '../../../../src/'

  let text = undefined

  const on = ({ type }) => {
    text = type
  }
</script>

<Graphic width={500} height={500}>

  <Label x={250} y={30} text="Section interactions:" />

  <Section 
    padding={75} 
    scaleX={scaleLinear().domain([0, 1])} 
    scaleY={scaleLinear().domain([0, 1])}
    onTouchdown={on}
    onTouchup={on}
    onTouchover={on}
    onTouchout={on}
  >
    <Rectangle fill="green" />

    <Label x={0.5} y={0.5} {text} fill="white" />
  </Section>

</Graphic>
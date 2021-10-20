<script>
  import { scaleLinear } from 'd3-scale'
	import { 
    Graphic, Section, Label, Point, Rectangle, Line, Polygon, XAxis, YAxis
  } from '../../../../src/'

  let textSection = undefined

  const onSection = ({ type }) => {
    textSection = type
  }

  let textMarks = undefined

  const onMarks = ({ type, markType }) => {
    textMarks = `${markType}: ${type}`
  }

  const markInteractions = {
    onTouchdown: onMarks,
    onTouchup: onMarks,
    onTouchover: onMarks,
    onTouchout: onMarks
  }
</script>

<Graphic width={500} height={1000} scaleX={[0, 500]} scaleY={[0, 1000]}>
  
  <Label x={250} y={25} text="Section:" />

  <Section 
    y1={0} y2={500}
    padding={75} 
    scaleX={scaleLinear().domain([0, 1])} 
    scaleY={scaleLinear().domain([0, 1])}
    onTouchdown={onSection}
    onTouchup={onSection}
    onTouchover={onSection}
    onTouchout={onSection}
  >
    <Rectangle fill="green" />

    <Label x={0.5} y={0.5} text={textSection} fill="white" />
  </Section>

  <Label x={250} y={530} text="Marks:" />

  <Section
    y1={500}
    y2={1000}
    padding={75}
    scaleX={scaleLinear().domain([0, 1])} 
    scaleY={scaleLinear().domain([0, 1])}
  >

    <Point 
      x={0.2} y={0.2}
      radius={25}
      {...markInteractions}
    />

    <Rectangle
      x1={0.5} x2={0.9}
      y1={0.1} y2={0.4}
      fill="blue"
      {...markInteractions}
    />

    <Polygon
      x={[0.2, 0.45, 0.2]}
      y={[0.4, 0.4, 0.8]}
      fill="yellow"
      {...markInteractions}
    />

    <Line
      x={[0.5, 0.7, 0.9]}
      y={[0.6, 0.8, 0.7]}
      stroke="red"
      strokeWidth={15}
      {...markInteractions}
    />
  
    <Label x={0.5} y={0.9} text={textMarks} />

  </Section>

</Graphic>
<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Label } from '../../../../../src/'
  


  const data = {
      x: 5,
      y: 10,
      text: "Testing"
  }

</script>

<Graphic 
  width={500}
  height={500}
  scaleX={scaleLinear().domain([0, 500])}
  scaleY={scaleLinear().domain([0, 500])}
>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 20])}
	scaleY={scaleLinear().domain([0, 20])}
  >
    
    <Label 
        x={data.x}
        y={data.y}
        text={data.text}
    />

  </Section>

</Graphic>
<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Label, LabelLayer } from '../../../../../src/'
  
  const toRadian = degree => (degree / 180) * Math.PI

  const data = {
      x: [5, 3, 2],
      y: [10, 5, 2],
      text: ["Testing1", "Testing2", "Testing3"],
      rotate: [45, 10, 90].map(toRadian)
  }

   let isActive = false

</script>

<Graphic
  width={500}
  height={500}
  scaleX={scaleLinear().domain([0, 500])}
  scaleY={scaleLinear().domain([0, 500])}
>
  <Section
    x1={50}
    x2={450}
    y1={50}
    y2={450}
    scaleX={scaleLinear().domain([0, 20])}
    scaleY={scaleLinear().domain([0, 20])}
  >
    <g class="test-labels">
      <Label
        x={data.x[0] + 3}
        y={data.y[0] + 3}
        text={data.text[0]}
        fontFamily="Georgia"
        fontSize="20"
        fontWeight="bold"
        rotate={data.rotate[0]}
        onMouseover={() => console.log('mouseover')}
        onClick={() => {
          console.log("click");
          isActive = true;
        }}
        fill={isActive ? "blue" : "yellow"}
      />

      <LabelLayer
        x={data.x}
        y={data.y}
        text={data.text}
        fontFamily="Georgia"
        fontSize="20"
        fontWeight="bold"
        rotate={data.rotate}
      />
    </g>
  </Section>
</Graphic>

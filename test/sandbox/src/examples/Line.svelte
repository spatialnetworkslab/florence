<script>
  import { scaleLinear } from "d3-scale";
  import { Graphic, Section, Line, LineLayer } from "../../../../src/";
  import DataContainer from "@snlab/florence-datacontainer";

  const data = new DataContainer({
    x: [1, 2, 4, 6, 9, 10, 12, 13],
    y: new Array(8).fill(0).map((_, i) => Math.random() * i)
  });

  const multiLineString = {
    type: "MultiLineString",
    coordinates: [
      [[0, 0], [2, 8], [9, 9]], 
      [[1, 1], [4, 4], [1, 4], [4, 1]]
    ]
  };

  const multiLineString2 = {
    type: "MultiLineString",
    coordinates: [
      [[0, 0], [4, 4], [8, 8]],
      [[2, 0], [6, 1], [8, 2]]
    ]
  };

  let clicked = false
  $: geometry = clicked ?
    multiLineString2 :
    multiLineString
</script>

<Graphic width={500} height={500}>

  <Section
    x1={50}
    x2={450}
    y1={50}
    y2={450}
    scaleX={scaleLinear().domain(data.domain('x'))}
    scaleY={scaleLinear().domain(data.domain('y'))}
    padding={10}>

    <Line
      {geometry}
      strokeWidth={2}
      stroke={clicked ? 'green' : 'red'}
      onClick={() => { clicked = !clicked }} 
      transition={2000}
    />

    <LineLayer
      x={[data.column('x')]}
      y={[data.column('y')]}
      strokeWidth={10}
      stroke={clicked ? 'green' : 'red'}
      onClick={() => { clicked = !clicked }} 
    />

  </Section>

</Graphic>

<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Line, LineLayer } from '../../../../../src/'

  const x = [1, 2, 4, 6, 9, 10, 12, 13]
  const y = new Array(8).fill(0).map((_, i) => Math.random() * i)

  const multiLineString = {
    type: 'MultiLineString',
    coordinates: [
      [[0, 0], [2, 8], [9, 9]],
      [[1, 1], [4, 4], [1, 4], [4, 1]]
    ]
  }

  let clicked = false
</script>

<Graphic width={500} height={500}>
  <Section
    x1={0.1}
    x2={0.9}
    y1={0.1}
    y2={0.9}
    scaleX={scaleLinear().domain([1, 13])}
    scaleY={scaleLinear().domain([0, 8])}
    padding={10}
  >
    <g class="line-test">
      <LineLayer
        x={[x]}
        y={[y]}
        strokeWidth={10}
        stroke={clicked ? "green" : "red"}
        onClick={() => (clicked = true)}
      />

      <Line
        geometry={multiLineString}
        strokeWidth={7}
        stroke={clicked ? "green" : "red"}
        onClick={() => (clicked = true)}
      />
    </g>
  </Section>
</Graphic>

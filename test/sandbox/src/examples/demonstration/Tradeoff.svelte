<script>
  import { Graphic, Section, Point, Label, FuncLine, XAxis, YAxis } from '../../../../src/'
  import { scaleLinear } from 'd3-scale'
  import linearRegression from '../helpers/linearRegression.js'

  let points = [
    { name: 'd3', difficulty: 80, flexibility: 90 },
    { name: 'react-vis', difficulty: 40, flexibility: 45 },
    { name: 'vega-lite', difficulty: 65, flexibility: 65 },
    { name: 'recharts', difficulty: 55, flexibility: 50 },
    { name: 'Chart.js', difficulty: 10, flexibility: 15 },
    { name: 'echarts', difficulty: 75, flexibility: 70 },
    { name: 'c3', difficulty: 15, flexibility: 20 }
  ]

  const scaleDifficulty = scaleLinear().domain([0, 80])
  const scaleFlexibility = scaleLinear().domain([0, 90])

  $: regressionResults = linearRegression(points.map(p => p.flexibility), points.map(p => p.difficulty))

  $: lineFunc = x => regressionResults.intercept + (x * regressionResults.slope)

  const addFlorence = ({ localCoordinates }) => {
    points.push({ name: 'florence', difficulty: localCoordinates.x, flexibility: localCoordinates.y })
    points = points
  }
</script>

<Graphic width={600} height={600}>

  <Section
    padding={40}
    scaleX={scaleDifficulty}
    scaleY={scaleFlexibility}
    flipY
    onClick={addFlorence}
  >

    {#each points as point, i (i)}

      <Point
        x={point.difficulty}
        y={point.flexibility}
        radius={7}
        fill="steelblue"
        opacity={0.8}
      />

      <Label 
        x={point.difficulty}
        y={point.flexibility}
        text={point.name}
      />

    {/each}

    <FuncLine 
      func={lineFunc}
      strokeWidth={2}
      stroke="steelblue"
      transition={5000}
    />

    <XAxis title="Difficulty" />
    <YAxis title="Flexiblity" />

  </Section>

</Graphic>
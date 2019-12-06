<script>
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { Graphic, Section, Layer, Mark } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  let currentChartType = 'scatterplot'

  const data = new DataContainer({
    a: ['a', 'b', 'c', 'd'],
    b: [10, 30, 20, 50],
    c: [4, 9, 10, 8]
  })

  const scatterplotScales = {
    x: scaleLinear().domain(data.domain('b')),
    y: scaleLinear().domain(data.domain('c'))
  }

  const barchartScales = {
    x: scaleBand().domain(data.domain('a')).padding(0.2),
    y: scaleLinear().domain([0, data.domain('b')[1]])
  }

  $: scales = currentChartType === 'scatterplot' ? scatterplotScales: barchartScales

  // MARKS
  const scatterplotMarks = []
  const barchartMarks = []

  for (let row of data.rows()) {
    scatterplotMarks.push({
      type: 'Point',
      x: row.b,
      y: row.c,
      radius: 6,
      fill: 'red'
    })

    barchartMarks.push({
      type: 'Rectangle',
      x1: row.a,
      x2: ({ scaleX }) => scaleX(row.a) + scaleX.bandwidth(),
      y1: 0,
      y2: row.b,
      fill: 'blue'
    })
  }

  $: marks = currentChartType === 'scatterplot' ? scatterplotMarks : barchartMarks

  const indices = [0, 1, 2, 3]

  // LAYERS
  const scatterplotLayer = {
    type: 'Point',
    x: data.column('b'),
    y: data.column('c'),
    radius: 6,
    fill: 'red'
  }

  const barchartLayer = {
    type: 'Rectangle',
    x1: data.column('a'),
    x2: ({ scaleX }) => data.map('a', a => scaleX(a) + scaleX.bandwidth()),
    y1: 0,
    y2: data.column('b'),
    fill: 'blue'
  }

  $: layer = currentChartType === 'scatterplot' ? scatterplotLayer : barchartLayer
</script>

<label for="type-selector">Chart:</label>
<select name="type-selector" bind:value={currentChartType}>
  <option value="scatterplot">Scatterplot</option>
  <option value="barchart">Bar chart</option>
</select>

<Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scales.x}
    scaleY={scales.y}
    padding={10}
  >

    <Layer 
      {...layer}
      transition={2000}
    />
  
  </Section>

</Graphic>
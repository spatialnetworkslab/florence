<script>
  import { 
    Graphic, Section, 
    Layer,
    XAxis, YAxis
  } from '../../../../src/'

  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear, scaleBand } from 'd3-scale'
  import shuffle from '../helpers/shuffle.js'

  const data = new DataContainer({
    a: new Array(10).fill().map((_, i) => i + Math.random() * 2),
    b: new Array(10).fill().map((_, i) => i + Math.random() * 2),
    c: shuffle('abcdefghij'.split(''))
  })

  let currentVisualization = 'scatterplot'

  const scatterplotX = scaleLinear().domain(data.domain('a'))
  const scatterplotY = scaleLinear().domain(data.domain('b'))

  const barchartX = scaleBand().domain(data.domain('c')).padding(0.2)
  const barchartY = scaleLinear().domain([0, data.domain('a')[1]])

  const pointProps = {
    type: 'Point',
    x: data.column('a'),
    y: data.column('b'),
    fill: 'steelblue',
    radius: 6
  }

  const rectangleProps = {
    type: 'Rectangle',
    x1: data.column('c'),
    x2: ({ scaleX }) => data.map('c', c => scaleX(c) + scaleX.bandwidth()),
    y1: 0,
    y2: data.column('a'),
    fill: 'rgb(254, 75, 131)'
  }

  $: layerProps = currentVisualization === 'scatterplot'
    ? pointProps
    : rectangleProps
</script>

<select bind:value={currentVisualization}>
  <option value="scatterplot">Scatterplot</option>
  <option value="barchart">Bar chart</option>
</select>

<br />

<Graphic width={500} height={500}>

  <Section
    padding={30}
    scaleX={currentVisualization === 'scatterplot' ? scatterplotX : barchartX}
    scaleY={currentVisualization === 'scatterplot' ? scatterplotY : barchartY}
    flipY
  >
  
    <Layer
      {...layerProps}
      transition={2000}
    />

    <XAxis transition={2000} />
    <YAxis transition={2000} />

  </Section>

</Graphic>
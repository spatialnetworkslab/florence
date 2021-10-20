<script>
  import { 
    Graphic, Section, 
    RectangleLayer,
    XAxis, YAxis
  } from '../../../../src/'

  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale'
  import { schemeAccent } from 'd3-scale-chromatic'

  const data = new DataContainer({
    a: [5, 2, 7, 3, 6],
    b: [6, 5, 2, 11, 3],
    c: [2, 6, 1, 5, 3],
    name: ['apple', 'banana', 'coconut', 'durian', 'elderberry']
  }).rowCumsum(['a', 'b', 'c'], { asInterval: true })

  let scaleX = scaleBand().domain(data.domain('name')).padding(0.2)
  const scaleY = scaleLinear().domain([0, data.domain('c')[1]])
  const colorScale = scaleOrdinal().domain(['a', 'b', 'c']).range(schemeAccent)

  let transformation = 'identity'
  let vjust = 0

  $: {
    if (transformation === 'identity') {
      scaleX.padding(0.2)
      vjust = 0
    }
    if (transformation === 'polar') {
      scaleX.padding(0)
      vjust = 1
    }

    scaleX = scaleX
  }
</script>

<select bind:value={transformation}>
  <option value="identity">Identity</option>
  <option value="polar">Polar</option>
</select>

<br />

<Graphic width={500} height={500}>

  <Section
    padding={30}
    {scaleX}
    {scaleY}
    {transformation}
    flipY
  >

    {#each data.rows() as row, i (i)}

      <RectangleLayer
        x1={row.name}
        x2={({ scaleX }) => scaleX(row.name) + scaleX.bandwidth()}
        y1={[row.a[0], row.b[0], row.c[0]]}
        y2={[row.a[1], row.b[1], row.c[1]]}
        fill={['a', 'b', 'c'].map(colorScale)}
      />

    {/each}

    <XAxis {vjust} />
    <YAxis />
  
  </Section>

</Graphic>
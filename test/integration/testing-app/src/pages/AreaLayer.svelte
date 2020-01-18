<script>
  import { scaleLinear, scaleOrdinal } from 'd3-scale'
  import { Graphic, Section, Area, AreaLayer, XAxis, YAxis } from '../../../../../src'
  import DataContainer from '@snlab/florence-datacontainer'

  const padding = {top: 20, right: 20, bottom: 30, left: 30}

  let data = [
    {"u": 1,  "v": 12, "w": 15}, {"u": 2,  "v": 12, "w": 12},
    {"u": 3,  "v": 15, "w": 17}, {"u": 4,  "v": 15, "w": 17},
    {"u": 5,  "v": 17, "w": 12}, {"u": 6,  "v": 16, "w": 15},
    {"u": 7,  "v": 14, "w": 12}, {"u": 8,  "v": 18, "w": 12},
    {"u": 9,  "v": 20, "w": 20}, {"u": 10, "v": 15, "w": 28},
    {"u": 11, "v": 18, "w": 18}, {"u": 12, "v": 20, "w": 16},
    {"u": 13, "v": 20, "w": 12}, {"u": 14, "v": 21, "w": 14},
    {"u": 15, "v": 15, "w": 20}, {"u": 16, "v": 21, "w": 20},
    {"u": 17, "v": 19, "w": 18}, {"u": 18, "v": 24, "w": 10},
    {"u": 19, "v": 16, "w": 20}, {"u": 20, "v": 22, "w": 12}
  ]

  const dataContainer = new DataContainer(data)

  const rowCumSum = dataContainer.rowCumsum([
    'v', 'w'
  ], { asInterval: 'true' })

  const columnNames = ['v', 'w']

  const xDomain = [0, 20]
  const yDomain = [0, 100]

  const scaleX = scaleLinear().domain(xDomain)
  const scaleY = scaleLinear().domain(yDomain)
  const scaleColor = scaleOrdinal()
    .domain(columnNames)
    .range(['#af8dc3', '#7fbf7b'])

  let hoveredKey = null

  // only works when hoveredKey is passed as param
  // function handleFill (key) {
  //   const colors = columnNames.map(c => scaleColor(c))
  //   // console.log(hoveredKey)
  //   return key === hoveredKey ? 'pink' : colors[+key]
  // }
</script>

<Graphic
  width={700}
  height={500}
>

  <Section
    {scaleX}
		{scaleY}
    {padding}
    flipY
  >

    <!-- {#each columnNames as c}
      <Area
        x1={rowCumSum.column('u')}
        y1={rowCumSum.column(c).map(d => d[0])}
        y2={rowCumSum.column(c).map(d => d[1])}
        fill= {scaleColor(c)}
      />
    {/each} -->

    <AreaLayer
      x1={columnNames.map(_ => rowCumSum.column('u'))}
      y1={({ scaleY }) => columnNames.map(c => rowCumSum.column(c).map(d => scaleY(d[0])))}
      y2={columnNames.map(c => rowCumSum.column(c).map(d => d[1]))}
      fill={key => key === hoveredKey ? '#eee0cb' : columnNames.map(c => scaleColor(c))[+key]}
      onMouseover={({ key }) => hoveredKey = key }
      onMouseout={() => hoveredKey = null }
    />
      <!-- fill={key => handleFill(key, hoveredKey)} -->

    <XAxis baseLine={false} />
    <YAxis baseLine={false} />

  </Section>

</Graphic>

<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Area, XAxis, YAxis } from '../../../../../src'
  import DataContainer from '@snlab/florence-datacontainer'

  const padding = {top: 20, right: 20, bottom: 30, left: 30}

 let data = [
  {"u": 1,  "v": 28}, {"u": 2,  "v": 55},
  {"u": 3,  "v": 43}, {"u": 4,  "v": 91},
  {"u": 5,  "v": 81}, {"u": 6,  "v": 53},
  {"u": 7,  "v": 19}, {"u": 8,  "v": 87},
  {"u": 9,  "v": 52}, {"u": 10, "v": 48},
  {"u": 11, "v": 55}, {"u": 12, "v": 49},
  {"u": 13, "v": 87}, {"u": 14, "v": 66},
  {"u": 15, "v": 17}, {"u": 16, "v": 27},
  {"u": 17, "v": 68}, {"u": 18, "v": 16},
  {"u": 19, "v": 49}, {"u": 20, "v": 15}
 ]

 let dataContainer = new DataContainer(data)

 const uDomain = dataContainer.domain('u')
 const vDomain = dataContainer.domain('v')

 const scaleU = scaleLinear().domain(uDomain)
 const scaleV = scaleLinear().domain([0, vDomain[1]])

 let isHovered = false
</script>

<Graphic
  width={700}
  height={500}
>

  <Section
    scaleX={scaleU}
		scaleY={scaleV}
    {padding}
    flipY
  >

    <Area
      x1={({ scaleX }) => dataContainer.column('u').map(d => scaleX(d))}
      y1={dataContainer.column('v')}
      fill={isHovered ? 'rgba(39,127,245,0.8)' : 'rgba(8,24,46,0.8)'}
      onMouseover={() => isHovered = !isHovered}
      onMouseout={() => isHovered = !isHovered}
    />

    <XAxis baseLine={false} />
    <YAxis baseLine={false} />

  </Section>

</Graphic>

<script context="module">
  import { csvParse  } from 'd3-dsv'
  export async function preload() {
    const response = await this.fetch('https://gist.githubusercontent.com/mbostock/ddc6d50c313ebe6edb45519f43358c6c/raw/c443ed14c34c5c1b544949a546dd9d0acd05bad3/temperatures.csv')
    const text = await response.text()
    const data = []
    csvParse(text, (d, i, columns) => {
      for (let i = 1; i < 13; ++i) {
        data.push({
          date: new Date(+d.Year, i - 1, 1), 
          value: +d[columns[i]]  
        })
      }
    })

    return { data }
  }
</script>

<script>
  import { scaleLinear, scaleTime, scaleSequential } from 'd3-scale'
  import { interpolateRdBu } from 'd3-scale-chromatic'
  import { Graphic, Section, Label, PointLayer, Line, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  export let data

  // set up data container 
  const dataContainer = new DataContainer(data)

  // set scales
  const scaleX = scaleTime().domain(dataContainer.domain('date'))
  const scaleY = scaleLinear().domain(dataContainer.domain('value')).nice()
  const scaleColor = scaleSequential(interpolateRdBu).domain([dataContainer.domain('value')[1], dataContainer.domain('value')[0]])

</script>

<Graphic
  width={800}
  height={500}
>

  <Label
    x={400}
    y={10}
    text={'Global Temperature Trends'}
  />

  <Section
    {scaleX} 
		{scaleY}
    padding={{left: 40, right: 30, top: 20, bottom: 30}}
    flipY
  >  

    <PointLayer
      x={dataContainer.column('date')}
      y={dataContainer.column('value')}
      radius={2.5}
      fill={dataContainer.map('value', scaleColor)}
      stroke={'#000'}
      strokeOpacity={0.2}
    />

    <Line
      x={dataContainer.domain('date')}
      y={[0, 0]}
      strokeWidth={0.2}
    />

    <XAxis 
      baseLine={false}
    /> 

    <YAxis
      baseLine={false}
    />

  </Section>

</Graphic>
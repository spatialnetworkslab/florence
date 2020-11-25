<script>
  import { csv } from 'd3-fetch'
  import { scaleLinear, scaleTime, scaleSequential } from 'd3-scale'
  import { interpolateRdBu } from 'd3-scale-chromatic'
  import { 
    Graphic, PointLayer, Line, XAxis, YAxis
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let dataContainer, scaleX, scaleY, scaleColor
</script>

<!-- <script>
  import { csvParse } from 'd3-dsv';
  import { csv } from 'd3-fetch';
  import { scaleLinear, scaleTime, scaleSequential } from 'd3-scale';
  import { interpolateRdBu } from 'd3-scale-chromatic';
  import { Graphic, Section, PointLayer, Line, XAxis, YAxis } from '@snlab/florence';
  import DataContainer from '@snlab/florence-datacontainer';

  let done = false;
  let data;
  const reformattedData = [];
  csv('/data/global-temp-trends.csv', (d, i, columns) => {
    for (let i = 1; i < 13; ++i) {
      reformattedData.push({
        date: new Date(+d.Year, i - 1, 1),
        value: +d[columns[i]]
      });
    }
  }).then(() => {
    data = reformattedData;
    done = true;
  });

  let dataContainer;
  let scaleX, scaleY, scaleColor;
  $: {
    if (done) {
      dataContainer = new DataContainer(data);

      scaleX = scaleTime().domain(dataContainer.domain("date"));
      scaleY = scaleLinear()
        .domain(dataContainer.domain("value"))
        .nice();
      scaleColor = scaleSequential(interpolateRdBu).domain([
        dataContainer.domain("value")[1],
        dataContainer.domain("value")[0]
      ]);
    }
  }
</script> -->

<Graphic width={800} height={500}>

  {#if done}
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

      <XAxis baseLine={false} /> 
      <YAxis baseLine={false} /> 

    </Section>
  {/if}

</Graphic>

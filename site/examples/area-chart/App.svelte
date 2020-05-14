<script>
  import { Graphic, Section, Area, XAxis, YAxis } from '@snlab/florence';
  import DataContainer from '@snlab/florence-datacontainer';
  import { scaleLinear, scaleUtc, scaleBand } from 'd3-scale';
  import { autoType } from 'd3-dsv';
  import { csv } from 'd3-fetch';

  const padding = { top: 20, right: 20, bottom: 30, left: 30 };

  // set to true once data is loaded
  let done;
  let parsedData;
  csv(
    'https://gist.githubusercontent.com/mbostock/14613fb82f32f40119009c94f5a46d72/raw/d0d70ffb7b749714e4ba1dece761f6502b2bdea2/aapl.csv',
    autoType
  ).then(d => {
    parsedData = d;
    done = true;
  });

  let stockData;
  let closeDomain, dateDomain;
  let scaleDate, scaleClose;

  $: {
    if (done) {
      stockData = new DataContainer(parsedData);

      dateDomain = stockData.domain('date');
      closeDomain = stockData.domain('close');

      scaleDate = scaleUtc().domain(dateDomain);
      scaleClose = scaleLinear().domain([0, closeDomain[1]]);
    }
  }
</script>

<Graphic width={700} height={500}>

  {#if done}
  <Section
    scaleX={scaleDate}
		scaleY={scaleClose}
    {padding}
    flipY
  >
    <Area
      x1={stockData.column('date')}
      y1={stockData.column('close')}
      y2={Array(1280).fill(0)}
      fill={'steelblue'}
    />

    <XAxis baseLine={false} />

    <YAxis
      baseLine={false}
      title={'$ close'}
      titleVjust={'top'}
      titleHjust={0.035}
      titleRotation={0}
      titleFontWeight={'bold'}
    />

  </Section>
  {/if}

</Graphic>

<!-- adapted from https://observablehq.com/@d3/stacked-horizontal-bar-chart -->

<script>
  import { autoType } from 'd3-dsv';
  import { csv } from 'd3-fetch';
  import { sum } from 'd3-array';
  import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
  import { schemeSpectral } from 'd3-scale-chromatic';
  import { formatPrefix } from 'd3-format'
  import { Graphic, Section, RectangleLayer, XAxis, YAxis } from '@snlab/florence';
  import DataContainer from '@snlab/florence-datacontainer';

  let done = false;
  let data;
  csv(
    '/data/population-stacked-bars.csv',
    (d, i, columns) => (autoType(d), (d.total = sum(columns, c => d[c])), d)
  ).then(d => {
    data = d.sort((a, b) => b.total - a.total);
    done = true;
  });

  let dataContainer;
  let ageGroup, grouped, cumsum
  let scaleX, scaleY, scaleColor;

  $: {
    if (done) {
      dataContainer = new DataContainer(data);
      grouped = dataContainer.arrange({ total: 'descending' }).groupBy('name')

      // stack data
      ageGroup = ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '≥80']
      cumsum = grouped.map('$grouped', g => g.rowCumsum(ageGroup, { asInterval: true }))

      // set scales
      scaleX = scaleLinear().domain([0, dataContainer.domain('total')[1]]);
      scaleY = scaleBand().domain(grouped.column('name')).padding(0.1);
      scaleColor = scaleOrdinal()
        .domain(ageGroup)
        .range(schemeSpectral[ageGroup.length])
        .unknown("#ccc");
    }
  }
</script>

<Graphic width={800} height={1330}>

  {#if done}
    <Section
      {scaleX} 
      {scaleY}
      padding={{ left: 30, right: 10, top: 30, bottom: 0 }}
    >  

      {#each ageGroup as ag, i}
        <RectangleLayer
          x1={cumsum.map(row => row.column(ag)[0][0])}
          x2={cumsum.map(row => row.column(ag)[0][1])}
          y1={grouped.column('name')}
          y2={({ scaleY }) => grouped.map('name', n => scaleY(n) + scaleY.bandwidth())}
          fill={scaleColor(ag)}
        />
      {/each}

      <XAxis vjust={'top'} flip={true} baseLine={false} labelFormat={formatPrefix(",.0", 1e6)}/> 
      <YAxis baseLine={false} /> 
    </Section>
  {/if}

</Graphic>

<!-- adapted from https://observablehq.com/@d3/density-contours -->
<!-- YAxis scaling bug needs to be fixed -->
<script>
  import { tsv } from 'd3-fetch';
  import { contourDensity } from 'd3-contour';
  import { scaleLinear } from 'd3-scale';
  import { format } from 'd3-format';
  import { Graphic, Section, PointLayer, Polygon, XAxis, YAxis } from '@snlab/florence';
  import DataContainer from '@snlab/florence-datacontainer';

  let done = false;
  let data;

  tsv('/data/eruptions.tsv', ({ waiting: x, eruptions: y }) => ({ x: +x, y: +y })).then(d => {
    data = d;
    done = true;
  });

  const width = 900;
  const height = 600;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  let dataContainer;
  let domainX, domainY;
  let scaleX, scaleY;
  let contours;

  $: {
    if (done) {
      dataContainer = new DataContainer(data);

      domainX = dataContainer.domain('x');
      domainY = dataContainer.domain('y');
      console.log('domain x', domainX)

      scaleX = scaleLinear()
        .domain(domainX)
        .nice()
        .rangeRound([padding.left, width - padding.right]);
      scaleY = scaleLinear()
        .domain(domainY)
        .nice()
        .rangeRound([height - padding.bottom, padding.top]);

      contours = contourDensity()
        .x(d => scaleX(d.x))
        .y(d => scaleY(d.y))
        .size([width, height])
        .bandwidth(30)
        .thresholds(30)(data);
    }
  }
</script>

<Graphic {width} {height} {padding}> 

    {#if done}
      {#each contours as c, i}
        <Polygon
          geometry={c}
          stroke={'steelblue'}
          strokeWidth={i % 5 ? 0.25 : 1}
          fill={'none'}
        />
      {/each}

      <PointLayer
        x={dataContainer.map('x', x => scaleX(x))}
        y={dataContainer.map('y', y => scaleY(y))}
        radius={2}
      />

      <XAxis scale={scaleX} baseLine={false} /> 
      <YAxis scale={scaleY} baseLine={false} labelFormat={format('.1f')} />
    {/if}

</Graphic>

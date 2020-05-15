<!-- adapted from https://observablehq.com/@d3/donut-chart -->
<script>
  import { Graphic, Section, RectangleLayer, LabelLayer } from '@snlab/florence';
  import DataContainer from "@snlab/florence-datacontainer";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { quantize } from "d3-interpolate";
  import { interpolateSpectral } from "d3-scale-chromatic";
  import { csv } from "d3-fetch";
  import { autoType } from "d3-dsv";

  let done = false;
  let parsedData;
  const data = csv(
    "/data/population.csv",
    // "https://gist.githubusercontent.com/mbostock/a3541c73fdccd432acc8b11bf9f02641/raw/2bd0fce0bf34b020e93c5f6527b5a9d08c33ff06/population-by-age.csv",
    autoType
  ).then(d => {
    parsedData = d;
    done = true;
  });

  let dataContainer, cumSum;
  let scaleX, scaleY, scaleColor;
  let numRows
  $: {
    if (done) {
      dataContainer = new DataContainer(parsedData);
      cumSum = dataContainer.cumsum({ cumsum: "value" }, { asInterval: true });
      numRows = cumSum.column('cumsum').length
      scaleX = scaleLinear().domain([0, cumSum.domain("cumsum")[1]]);
      scaleY = scaleLinear().domain([0, 15]);
      scaleColor = scaleOrdinal()
        .domain(cumSum.domain("name"))
        .range(
          quantize(
            t => interpolateSpectral(t * 0.8 + 0.1),
            cumSum.rows().length
          ).reverse()
        );
    }
  }
</script> 

<Graphic width={500} height={530}>
  {#if done}
    <Section
      {scaleX}
      {scaleY}
      transformation={'polar'}
      flipY
    >
      <!-- slices and age labels -->
      <RectangleLayer 
        x1={cumSum.map('cumsum', d => d[0])}
        x2={cumSum.map('cumsum', d => d[1])}
        y1={Array(numRows).fill(10)}
        y2={Array(numRows).fill(15)}
        fill={cumSum.map('name', scaleColor)}
        stroke={'white'}
        strokeWidth={1}
      />
      <LabelLayer
        x={cumSum.map('cumsum', d => d[0] + (d[1] - d[0]) / 2)}
        y={Array(numRows).fill(12.5)}
        text={cumSum.column('name')}
        fontSize={11}
        fontWeight={'bold'}
        fontFamily={'sans-serif'}
      />
    </Section>

    <!-- population labels (omitted in last 4 slices) -->
    <Section
      {scaleX}
      {scaleY}
      transformation={'polar'}
      flipY
      zoomIdentity={{ x: 0, y: 15, kx: 1, ky: 1 }}
    >
      <LabelLayer
        x={cumSum.column('cumsum').slice(0, numRows - 4).map(d => d[0] + (d[1] - d[0]) / 2)}
        y={Array(numRows - 4).fill(12.5)}
        text={cumSum.column('value').slice(0, numRows - 4).map(d => d.toLocaleString())}
        fontSize={11}
        fontWeight={'lighter'}
        fontFamily={'sans-serif'}
      />
    </Section>
  {/if}
</Graphic>

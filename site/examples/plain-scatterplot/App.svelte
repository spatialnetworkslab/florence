<!-- adapted from https://vega.github.io/vega-lite/examples/point_color_with_shape.html -->
<script>
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import {
    Graphic,
    Section,
    Label,
    XAxis,
    YAxis,
    PointLayer
  } from "@snlab/florence/src/index.js";
  import DataContainer from "@snlab/florence-datacontainer";
  import { json } from "d3-fetch";

  let done = false;
  let data;
  json("/data/cars.json").then(d => {
    data = d;
    done = true;
  });

  let dataContainer;
  let domainX, domainY;
  let scaleX, scaleY, scaleColour;

  $: {
    if (done) {
      dataContainer = new DataContainer(data).dropNA();

      domainX = dataContainer.domain("Horsepower");
      domainX[0] = 0;
      domainY = dataContainer.domain("Miles_per_Gallon");
      domainY[0] = 0;

      scaleX = scaleLinear().domain(domainX);
      scaleY = scaleLinear().domain(domainY);
      scaleColour = scaleOrdinal()
        .domain(dataContainer.domain("Origin"))
        .range(["#e45756", "#f58518", "#4c78a8"]);
    }
  }
</script>

<Graphic 
  width={'100%'}
  height={'100%'}
  viewBox={'0 0 500 500'}
>
  <Label
    x={250}
    y={10}
    text={'Miles per gallon vs horsepower'}
  />

  {#if done}
    <Section
      {scaleX}
      {scaleY}
      padding={{left: 40, right: 25, top: 25, bottom: 40}}
      flipY
    >

      <PointLayer
        x={dataContainer.column('Horsepower')}
        y={dataContainer.column('Miles_per_Gallon')}
        fill={'#4c78a8'}
        opacity={0.5}
        radius={5}
      />

      <XAxis
        title={'Horsepower'}
        titleFontWeight={'bold'}
      />

      <YAxis
        title='Miles per gallon'
        titleFontWeight={'bold'}
      />

    </Section>
  {/if}

</Graphic>
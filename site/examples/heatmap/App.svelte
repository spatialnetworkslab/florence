<script>
  import { scaleLinear, scaleSequential } from "d3-scale";
  import { interpolateYlGnBu } from "d3-scale-chromatic";
  import { json } from "d3-fetch";
  import {
    Graphic,
    Section,
    Label,
    Rectangle,
    RectangleLayer,
    XAxis,
    YAxis
  } from "@snlab/florence";
  import DataContainer from "@snlab/florence-datacontainer";

  let done = false;
  let data;
  json("https://github.com/vega/vega-datasets/blob/master/data/movies.json").then(d => {
    data = d;
    done = true;
  });

  let reformattedData, dataContainer, binned;
  let imdbDomain, countDomain, rtDomain;
  let scaleX, scaleY, scaleColor;

  $: {
    if (done) {
      reformattedData = data.map(d => {
        return {
          Title: String(d.Title),
          Rotten_Tomatoes_Rating: d.Rotten_Tomatoes_Rating,
          IMDB_Rating: d.IMDB_Rating
        };
      });

      dataContainer = new DataContainer(reformattedData);

      binned = dataContainer
        .dropNA()
        .bin([
          { groupBy: "IMDB_Rating", method: "EqualInterval", numClasses: 38 },
          {
            groupBy: "Rotten_Tomatoes_Rating",
            method: "EqualInterval",
            numClasses: 20
          }
        ])
        .summarise({ count: { IMDB_Rating: "count" } });

      imdbDomain = binned.domain("bins_IMDB_Rating"); // [1.6, 9.2]
      rtDomain = binned.domain("bins_Rotten_Tomatoes_Rating"); // [1, 100]
      countDomain = binned.domain("count");

      scaleY = scaleLinear().domain(rtDomain);
      scaleX = scaleLinear().domain(imdbDomain);
      scaleColor = scaleSequential(interpolateYlGnBu).domain(countDomain);
    }
  }
</script>

<Graphic 
  width={600}
  height={400}
>

  {#if done}
    <Section
      {scaleX}
      {scaleY}
      padding={{left: 40, right: 25, top: 25, bottom: 40}}
      flipY
    >

      {#each binned.rows() as bin}
        <Rectangle
          x1={bin['bins_IMDB_Rating'][0]}
          x2={bin['bins_IMDB_Rating'][1]}
          y1={bin['bins_Rotten_Tomatoes_Rating'][0]}
          y2={bin['bins_Rotten_Tomatoes_Rating'][1]}
          fill={scaleColor(bin['count'])}
        />
      {/each}

      <XAxis
        title={"IMDB Rating"}
        baseLine={false}
      />

      <YAxis
        title={"Rotten Tomatoes Rating"}
        baseLine={false}
      />

    </Section>
  {/if}

</Graphic>

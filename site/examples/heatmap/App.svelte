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

  let data

  json("/data/imdb.json").then(d => {
    data = d.map(r => ({ ...r, Title: String(r.Title) }))
  })

  let binned
  let imdbDomain, countDomain, rtDomain;
  let scaleX, scaleY, scaleColor;

  $: {
    if (data) {
      binned = new DataContainer(data)
        .select(['IMDB Rating', 'Rotten Tomatoes Rating'])
        .dropNA()
        .bin([
          { groupBy: "IMDB Rating", method: "EqualInterval", numClasses: 38 },
          {
            groupBy: "Rotten Tomatoes Rating",
            method: "EqualInterval",
            numClasses: 20
          }
        ])
        .summarise({ count: { "IMDB Rating": "count" } });

      imdbDomain = binned.domain("bins_IMDB Rating"); // [1.6, 9.2]
      rtDomain = binned.domain("bins_Rotten Tomatoes Rating"); // [1, 100]
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

  {#if binned}
    <Section
      {scaleX}
      {scaleY}
      padding={{left: 40, right: 25, top: 25, bottom: 40}}
      flipY
    >

      {#each binned.rows() as bin}
        <Rectangle
          x1={bin['bins_IMDB Rating'][0]}
          x2={bin['bins_IMDB Rating'][1]}
          y1={bin['bins_Rotten Tomatoes Rating'][0]}
          y2={bin['bins_Rotten Tomatoes Rating'][1]}
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

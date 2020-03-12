<script>
  import { scaleLinear, scalePoint, scaleOrdinal } from "d3-scale";
  import { schemeCategory10 } from "d3-scale-chromatic";
  import {
    Graphic,
    Section,
    PointLayer,
    XAxis,
    YAxis,
    Title,
    DiscreteLegend
  } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // switches for steps
  export let switch0 = true
  export let switch1 = true
  export let switch2 = true
  export let switch3 = true
  export let switch4 = true
  export let switch5 = true

  let data = new DataContainer({
    diameter: [
      4.7,
      6.1,
      7.9,
      6.6,
      6.7,
      5.3,
      11.6,
      11.1,
      5.5,
      10.6,
      6.4,
      4.9,
      8.8,
      12.5,
      12.7,
      8.6,
      13.1,
      5.8,
      8.9,
      9.1,
      10.3,
      9.4
    ],
    fruit: [
      'lime',
      'lemon',
      'grapefruit',
      'lemon',
      'orange',
      'lemon',
      'pomelo',
      'grapefruit',
      'lime',
      'pomelo',
      'lemon',
      'lime',
      'grapefruit',
      'pomelo',
      'grapefruit',
      'grapefruit',
      'pomelo',
      'lime',
      'orange',
      'grapefruit',
      'pomelo',
      'grapefruit'
    ]
  })

  const processedData = data
    .dropNA()
    .groupBy('fruit')
    .summarise({ meanDiameter: { diameter: 'mean' } })
    .arrange({ meanDiameter: 'descending' })

  const fruitDomain = data.domain("fruit");
  const scaleFruit = scalePoint()
    .domain(fruitDomain)
    .padding(0.2);
  const meanDiameterDomain = [0, processedData.domain("meanDiameter")[1] * 1.5]
  const scaleMeanDiameter = scaleLinear().domain(meanDiameterDomain)
  const scaleFruitColor = scaleOrdinal()
    .domain(fruitDomain)
    .range(schemeCategory10);

  const scaleRadius = scaleLinear()
    .domain(meanDiameterDomain)
    .range([2, 10]);
</script>


<Graphic 
  width={500} height={500}
>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    padding={40}
    scaleX={scaleFruit}
    scaleY={scaleMeanDiameter}
  >
    {#if switch0 || switch3}
      <PointLayer
        x={data.column('fruit')}
        y={data.column('diameter')}
        key={data.column('$key')}
        fill={switch3 ? data.column('fruit').map(d => scaleFruitColor(d)) : 'black'}
        radius={switch3 ? scaleRadius : 3}
      />
    {/if}

    {#if switch1 || switch4}
      <XAxis
        title={switch4 ? 'fruit' : ''}
      />
      <YAxis 
        title={switch4 ? 'diameter/cm' : ''}
      />
    {/if}

    {#if switch2}
      <Title 
        title={'Fruit Sizes'} 
        titleFontFamily={'Baskerville'}
        usePadding={true}
        />
    {/if}

    {#if switch5}
      <DiscreteLegend
        fill={scaleFruitColor}
        hjust={'right'}
        vjust={'top'}
        stroke={'white'}
        strokeWidth={2}
        labelPaddingX={-12}
        labelAnchorPoint={'left'}
        usePadding={true}
      /> 
    {/if}
  </Section>

</Graphic>
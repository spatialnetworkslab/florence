<!-- adapted from https://vega.github.io/vega-lite/examples/isotype_bar_chart.html -->
<script>
  import { Graphic, Section, SymbolLayer, Label } from '@snlab/florence';
  import DataContainer from '@snlab/florence-datacontainer';
  import { scaleOrdinal, scaleBand, scalePoint } from 'd3-scale';
  import FacetedSection from './FacetedSection.svelte';
  import { coordsCattle, coordsPig, coordsSheep } from './animalCoords.js'
  import { livestock } from './livestock.js'

  const dataContainer = new DataContainer(livestock);
  const grouped = dataContainer.groupBy('country');
  const countries = grouped.column('country');

  // outer section scales
  const countryDomain = dataContainer.domain('country');
  const scaleCountry = scaleBand()
    .domain(countryDomain)
    .padding(0.01);

  // inner section scales
  const scaleCol = scalePoint().domain([...Array(11).keys()].slice(1)).padding(0.8).round(true);
  const scaleAnimal = scaleBand()
    .domain(['cattle', 'pigs', 'sheep'])
    .padding(0.5);
  const scaleColor = scaleOrdinal()
    .domain(['cattle', 'pigs', 'sheep'])
    .range(['#684e32', 'pink', '#5b8395']);

  // animal shapes
  const scaleShape = scaleOrdinal()
    .domain(['cattle', 'pigs', 'sheep'])
    .range([coordsCattle, coordsPig, coordsSheep]);

  function getShape(animal) {
    return {
      type: 'Polygon',
      coordinates: scaleShape(animal)
    };
  }
</script>

<Graphic width={800} height={400} scaleY={scaleCountry} >
  <FacetedSection
    scaleX={scaleCol}
    scaleY={scaleAnimal}
    iterable={countries}
    groups={grouped}
    let:item={item}
    let:index={index}
    let:group={g}
  >
    <SymbolLayer
      x={g.column('col')}
      y={g.column('animal')}
      shape={key => getShape(g.column('animal')[key])}
      fill={key => scaleColor(g.column('animal')[key])}
      size={80}
    />
    <!-- redundant destructuring in y needed to work around point scaling bug -->
    <Label
      x={() => 10}
      y={({ scaleY }) => scaleY('pigs')} 
      text={item}
      rotation={-90}
      fontFamily={'sans-serif'}
      fontSize={10}
    />
  </FacetedSection>
</Graphic>

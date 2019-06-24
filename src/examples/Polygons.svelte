<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, CoordinateTransformation, Polygon, DataContainer } from '../sveg'

  function getRandomValueArray (N, range) {
    return new Array(N).fill(0).map(() => Math.random() * range)
  }

  let geometries = {
    a: {
      type: 'Polygon',
      coordinates: [
        [[0, 0], [5, 0], [7, 3], [7, 10], [9, 2]]
      ]
    },
    b: {
      type: 'Polygon',
      coordinates: [
        [[0, 2],  [4, 3], [5, 8], [7, 5], [10, 10], [9, 0], [0, 0]]
      ]
    }
  }

  let isHovering = false

  let transformation = 'identity'
  let chosenGeometry = 'a'
</script>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
  </select>
</div>

<div>
  <label for="geometry-select">Geometry:</label>
  <select name="geometry-select" bind:value={chosenGeometry}>
    <option value="a">A</option>
    <option value="b">B</option>
  </select>
</div>

<Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
  >

    <CoordinateTransformation {transformation}>

      <Polygon
        geometry={geometries[chosenGeometry]}
        onMouseover={() => isHovering = true}
        onMouseout={() => isHovering = false}
        fill={isHovering ? 'blue' : 'yellow'}
      />
    
    </CoordinateTransformation>
  
  </Section>

</Graphic>
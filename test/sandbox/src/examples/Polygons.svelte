<script>
  import { Graphic, Section, Polygon, PolygonLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  function getRandomValueArray (N, range) {
    return new Array(N).fill(0).map(() => Math.random() * range)
  }

  let geometries = {
    a: {
      type: 'Polygon',
      coordinates: [
        [[0, 0], [10, 0], [5, 10], [0, 0]],
        [[2, 2], [5, 8], [8, 2], [2, 2]]
      ]
    },
    b: {
      type: 'Polygon',
      coordinates: [
        [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]],
        [[3, 3], [3, 7], [7, 7], [7, 3], [3, 3]],
        [[7.5, 7.5], [7.5, 9.5], [9.5, 9.5], [9.5, 7.5], [7.5, 7.5]]
      ]
    },
    c: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [[0, 0], [3, 0], [4.5, 5], [3, 10], [0, 10], [0, 0]],
          [[1, 1], [1, 9], [2, 9], [4, 5], [2, 1], [1, 1]]
        ],
        [
          [[7, 0], [10, 0], [10, 10], [7, 10], [5.5, 5], [7, 0]]
        ]
      ]
    }
  }

  let isHovering = false

  let transformation = 'identity'
  let chosenGeometry = 'a'

  const log = console.log
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
    <option value="c">C</option>
  </select>
</div>

<Graphic width={500} height={500} onMouseover={() => { console.log('mouseover') }}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={[0, 10]}
    scaleY={[0, 10]}
    {transformation}
  >

    <Polygon
      geometry={geometries[chosenGeometry]}
      onMouseover={e => { isHovering = true; log(e) }}
      onMouseout={() => isHovering = false}
      fill={isHovering ? 'blue' : 'yellow'}
    />

    <!-- <PolygonLayer 
      geometry={[geometries[chosenGeometry]]}
      onMouseover={e => { isHovering = true; log(e) }}
      onMouseout={() => isHovering = false}
      fill={isHovering ? 'blue' : 'yellow'}
      key={[0]}
      transition={2000}
    /> -->
  
  </Section>

</Graphic>
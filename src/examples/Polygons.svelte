<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, CoordinateTransformation, Polygon, DataContainer } from '../sveg'

  function getRandomValueArray (N, range) {
    return new Array(N).fill(0).map(() => Math.random() * range)
  }

  let x = getRandomValueArray(10, 10)
  let y = getRandomValueArray(10, 10)

  let isHovering = false

  let transformation = 'identity'
</script>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
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
        {x} {y}
        onMouseover={() => isHovering = true}
        onMouseout={() => isHovering = false}
        fill={isHovering ? 'blue' : 'yellow'}
      />
    
    </CoordinateTransformation>
  
  </Section>

</Graphic>
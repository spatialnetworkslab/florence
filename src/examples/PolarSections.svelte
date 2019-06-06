<script>
  import { Graphic, Section, CoordinateTransformation, Point, Rectangle, DataContainer } from '../sveg'
  import { scaleLinear, scaleBand } from 'd3-scale'

  const data = new DataContainer({
    a: [1, 2, 3, 4, 5],
    b: [5, 6, 7, 8, 9]
  })

  const colors = ['red', 'blue', 'yellow', 'green']

  let height = 500
  let transformation = 'identity'
  let duration = 2000
</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
</div>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
  </select>
</div>

<div>
  <label for="duration">Transition time</label>
  <input name="duration" type="range" min="100" max="5000" bind:value={duration} />
</div>

<Graphic 
  width={500} {height}
  scaleX={scaleBand().domain(colors)}
  scaleY={scaleLinear().domain([0, 100])}
>

  <CoordinateTransformation {transformation}>
  
    {#each colors as color}

      <Section
        x1={color}
        x2={({ scaleX }) => scaleX(color) + scaleX.bandwidth()}
        y1={0}
        y2={100}
        scaleX={scaleLinear().domain(data.domain('a'))}
        scaleY={scaleLinear().domain(data.domain('b'))}
      >
      
        <Rectangle fill={color} opacity={0.2} transition={duration} />

        {#each data.rows() as row}

          <Point x={row.a} y={row.b} fill={color} transition={duration} />

        {/each}

      </Section>

    {/each}

  </CoordinateTransformation>

</Graphic>
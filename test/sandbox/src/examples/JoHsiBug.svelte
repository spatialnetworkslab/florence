<script>
  import { Graphic, Section, PointLayer } from '../../../../src/'
  import { scaleLinear } from 'd3-scale'

  const x1 = [1, 3, 5, 7, 9]
  const x2 = [0, 2, 4, 6, 8, 10]

  const y1 = [1, 2, 3, 4, 5]
  const y2 = [1, 2, 3, 4, 5, 6]

  let test = 'bla'
  
  $: x = test === 'bla' ? x1 : x2
  $: y = test === 'bla' ? y1 : y2

  function log () {
    console.log('hi!')
  }
</script>

<Graphic width={500} height={500}>

  <Section
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 7])}
  >

    <PointLayer {x} {y} radius={10} onMouseover={log} />
  
  </Section>

</Graphic>

<select bind:value={test}>
    <option value="bla">
        Bla
    </option>
  <option value="blabla">
    Blabla
  </option>
</select>
<script>
  import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, PointLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  const N = 100
	const data = new DataContainer(generateData(N, 0.25))
  
  function generateData (N, error) {
		const getError = () => -error + (Math.random() * (2 * error)) * N
		let data = { a: [], b: [] }
		for (let i = 0; i < N; i++) {
			data.a.push(i + getError())
			data.b.push(i + getError())
		}
		return data
  }

  const scaleX = scaleLinear().domain(data.domain('a'))
  const scaleY = scaleLinear().domain(data.domain('b'))

  let hoverIndex

  function onMouseover ({ index }) {
    console.log('mouseover')
    console.log(index)
    hoverIndex = index
  }

  function onMouseout ({ index }) {
    console.log('mouseout')
    console.log(index)
    hoverIndex = undefined
  }

  const log = console.log
</script>

<Graphic width={500} height={500} padding={50} renderer="canvas">

  <Section {scaleX} {scaleY} padding={20}>
  
    <PointLayer
      x={data.column('a')}
      y={data.column('b')}
      fill={({ index }) => index === hoverIndex ? 'red' : 'black'}
      radius={5}
      {onMouseover}
      {onMouseout}
      onTouchdown={onMouseover}
      onTouchup={onMouseout}
    />

  </Section>

</Graphic>

<br /><br />

{#if hoverIndex}
  <h1>OVER: {hoverIndex}</h1>
{/if}
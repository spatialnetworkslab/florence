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

  let hoverKey

  function onMouseover ({ key }) {
    console.log('mouseover')
    console.log(key)
    hoverKey = key
  }

  function onMouseout ({ key }) {
    console.log('mouseout')
    console.log(key)
    hoverKey = undefined
  }

  const log = console.log
</script>

<Graphic width={500} height={500}>

  <Section 
    {scaleX} {scaleY} padding={20}
    onTouchover={log}
    onTouchout={log}
  >
  
    <PointLayer
      x={data.column('a')}
      y={data.column('b')}
      fill={key => key === hoverKey ? 'red' : 'black'}
      radius={17}
      {onMouseover}
      {onMouseout}
      onTouchdown={onMouseover}
      onTouchup={onMouseout}
    />

  </Section>

</Graphic>

<br /><br />

{#if hoverKey}
  <h1>OVER: {hoverKey}</h1>
{/if}
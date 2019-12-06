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
    hoverKey = key
  }

  function onMouseout ({ key }) {
    if (hoverKey === key) hoverKey = undefined
  }
</script>

<Graphic width={500} height={500}>

  <Section {scaleX} {scaleY} padding={20}>
  
    <PointLayer
      x={data.column('a')}
      y={data.column('b')}
      fill={key => key === hoverKey ? 'red' : 'black'}
      radius={7}
      {onMouseover}
      {onMouseout}
    />

  </Section>

</Graphic>
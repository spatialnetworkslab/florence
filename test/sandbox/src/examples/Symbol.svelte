<script>
  import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, Symbol_, SymbolLayer } from '../../../../src/'
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

  function getRandomSymbol () {
    const symbols = ['circle', 'star4', 'star5', 'star', 'star6', 'star8', 'square']

    return symbols[Math.floor(Math.random() * symbols.length)]
  }

  let hoverKey

  function onMouseover ({ key }) {
    hoverKey = key
  }

  function onMouseout ({ key }) {
    if (hoverKey === key) hoverKey = undefined
  }

  const fills = new Array(N).fill(0).map(_ => ['#a8122c', '#006600'][Math.floor(Math.random() * 2)])
  const shapes = new Array(N).fill(0).map(getRandomSymbol)
</script>

<Graphic width={500} height={500}>

  <Section {scaleX} {scaleY} padding={20}>
  
    <!-- <PointLayer
      x={data.column('a')}
      y={data.column('b')}
      fill={key => key === hoverKey ? 'red' : 'black'}
      radius={7}
      {onMouseover}
      {onMouseout}
    /> -->

    {#each data.rows() as row, i (row.$key)}

      <Symbol_
        x={row.a}
        y={row.b}
        shape={getRandomSymbol()}
        radius={7}
        fill={hoverKey === row.$key ? 'orange' : fills[row.$key]}
        onMouseover={() => { onMouseover({ key: row.$key }) }}
        onMouseout={() => { onMouseout({ key: row.$key }) }}
      />

    {/each}

    <!-- <SymbolLayer 
      x={data.column('a')}
      y={data.column('b')}
      shape={key => shapes[key]}
      size={14}
      fill={key => key === hoverKey ? 'orange' : fills[key]}
      {onMouseover}
      {onMouseout}
    /> -->

  </Section>

</Graphic>

<script>
	import { scaleLinear, scalePoint, scaleBand } from 'd3-scale'
	import { Graphic, Grid, Section, PointLayer, Point } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

	export let N = 100
	let data = new DataContainer(generateData(N, 0.25))
	function generateData (N, error) {
    const getError = () => -error + (Math.random() * (2 * error)) * N
    const categories = ['a', 'b', 'c', 'd', 'e']

    let data = { a: [], b: [] }
    
		for (let i = 0; i < N; i++) {
			data.a.push(i + getError())
			data.b.push(categories[Math.floor(Math.random() * 5)])
    }

		return data
  }

  const domainB = data.domain('b')
  domainB.sort()
	const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scalePoint().domain(domainB)
  
  let bigPoint = { x: 50, y: 'c' }
  let dragPoint

  function handleDragStart (event) {
    dragPoint = event.localCoords
  }

  function handleDrag (event) {
    dragPoint = event.localCoords
  }

  function handleDragEnd (event) {
    dragPoint = undefined
    const hitKey = Number(event.hitKey)
    const position = event.localCoords

    data.updateRow(hitKey, { a: position.x, b: position.y })
    data = data
  }

</script>

<div>

	<Graphic width={500} height={500}>
		
		<Section
			x1={50} x2={450}
			y1={50} y2={450}
			scaleX={scaleA}
			scaleY={scaleB}
      backgroundColor="white"
      transformation="polar"
      zoomIdentity={{x: 0, y: 0, kx: 1.2, ky: 1.2}}
		>

			<PointLayer
        x={data.column('a')}
        y={data.column('b')}
        key={data.column('$key')}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      {#if dragPoint}

        <Point
          x={dragPoint.x}
          y={dragPoint.y}
          fill="red"
          radius={10}
        />

      {/if}

		</Section>

	</Graphic>

</div>
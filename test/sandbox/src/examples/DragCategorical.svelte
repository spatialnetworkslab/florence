<script>
	import { scaleLinear, scalePoint, scaleBand } from 'd3-scale'
	import { Graphic, Section, PointLayer, Point, polar } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

	const N = 100
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
  
  let hitIndex
  let dragPoint

  function onMousedrag (event) {
    if (event.dragType === 'start') {
      hitIndex = event.index
    }

    if (event.dragType === 'drag') {
      dragPoint = event.localCoordinates
    }

    if (event.dragType === 'end') {
      data.updateRow({ index: hitIndex }, { a: dragPoint.x, b: dragPoint.y })
      data = data

      hitIndex = undefined
      dragPoint = undefined
    }
  }

</script>

<div>

	<Graphic width={500} height={500}>
		
		<Section
			x1={0.1} x2={0.9}
			y1={0.1} y2={0.9}
			scaleX={scaleA}
			scaleY={scaleB}
      coordinates={polar()}
		>

			<PointLayer
        x={data.column('a')}
        y={data.column('b')}
        {onMousedrag}
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
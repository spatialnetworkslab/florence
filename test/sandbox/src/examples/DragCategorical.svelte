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
  let blockReindexing = false

  function onMousedrag (event) {
    if (event.dragType === 'start') {
      hitIndex = event.index
      blockReindexing = true
    }

    if (event.dragType === 'drag') {
      dragPoint = event.localCoordinates
    }

    if (event.dragType === 'end') {
      data.updateRow({ index: hitIndex }, { a: dragPoint.x, b: dragPoint.y })
      data = data

      hitIndex = undefined
      dragPoint = undefined
      blockReindexing = false
    }
  }

</script>

<div>

	<Graphic width={500} height={500}>
		
		<Section
			x1={50} x2={450}
			y1={50} y2={450}
			scaleX={scaleA}
			scaleY={scaleB}
      zoomIdentity={{x: 0, y: 0, kx: 1.2, ky: 1.2}}
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
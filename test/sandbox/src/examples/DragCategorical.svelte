<script>
	import { scaleLinear, scalePoint, scaleBand } from 'd3-scale'
	import { Graphic, Grid, Section, PointLayer, Point, createDragHandler } from '../../../../src/'
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
  
  let dragPoint
  let hitKey
  let blockReindexing = false

  const setBlockReindexing = bool => { blockReindexing = bool }

  function onDragstart (event) {
    dragPoint = event.localCoordinates
    hitKey = event.key
  }

  function onDrag (event) {
    dragPoint = event.localCoordinates
  }

  function onDragend (event) {
    dragPoint = undefined
    const position = event.localCoordinates

    data.updateRow(hitKey, { a: position.x, b: position.y })
    data = data
  }

  const drag = createDragHandler({
    onDragstart, onDrag, onDragend
  }, setBlockReindexing)

</script>

<div>

	<Graphic width={500} height={500}>
		
		<Section
			x1={50} x2={450}
			y1={50} y2={450}
			scaleX={scaleA}
			scaleY={scaleB}
      backgroundColor="pink"
      transformation="polar"
      zoomIdentity={{x: 0, y: 0, kx: 1.2, ky: 1.2}}
      {...drag.applySectionHandlers()}
      {blockReindexing}
		>

			<PointLayer
        x={data.column('a')}
        y={data.column('b')}
        key={data.column('$key')}
        {...drag.applyMarkHandlers()}
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
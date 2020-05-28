<script>
  import { tick } from 'svelte'
  import { Graphic, Section, PointLayer, XAxis, YAxis, Rectangle } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'
  import DataContainer from '@snlab/florence-datacontainer'

  const data = new DataContainer({
    a: new Array(100).fill().map((_, i) => i + (Math.random() * 10)),
    b: new Array(100).fill().map((_, i) => i + (Math.random() * 10))
  })

  const scale = scaleLinear().domain([0, 110])

  let section

  let dragging = false
  let rectangle

  let brushing = false
  let blockReindexing = false
  let startDelta

  const onMousedown = ({ screenCoordinates }) => {
    tick().then(() => {
      if (!brushing) {
        section.resetSelectRectangle()

        dragging = true
        
        rectangle = {
          x1: screenCoordinates.x,
          x2: screenCoordinates.x,
          y1: screenCoordinates.y,
          y2: screenCoordinates.y
        }

        section.selectRectangle(rectangle)
      }
    })
  }

  const onMousemove = ({ screenCoordinates }) => {
    if (dragging) {
      rectangle.x2 = screenCoordinates.x
      rectangle.y2 = screenCoordinates.y

      rectangle = rectangle

      section.updateSelectRectangle(rectangle)
    }
  }

  const onMouseup = () => {
    if (dragging) {
      dragging = false
    }
  }

  let selectedPoints = {}

  const selectPoint = ({ key }) => {
    selectedPoints[key] = true
    selectedPoints = selectedPoints
  }

  const deselectPoint = ({ key }) => {
    delete selectedPoints[key]
    selectedPoints = selectedPoints
  }

  let averageA = undefined
  let averageB = undefined

  $: {
    let keys = Object.keys(selectedPoints)
    if (keys.length > 0) {
      averageA = keys.map(key => data.row(key).a).reduce((a, b) => a + b) / keys.length
      averageB = keys.map(key => data.row(key).b).reduce((a, b) => a + b) / keys.length
    } else {
      averageA = undefined
      averageB = undefined
    }
  }

  const onMousedrag = (event) => {
    const screenCoordinates = event.screenCoordinates

    if (event.dragType === 'start') {
      brushing = true
      blockReindexing = true

      startDelta = {
        x1: screenCoordinates.x - rectangle.x1,
        x2: screenCoordinates.x - rectangle.x2,
        y1: screenCoordinates.y - rectangle.y1,
        y2: screenCoordinates.y - rectangle.y2
      }
    }
    
    if (event.dragType === 'drag') {
      rectangle = {
        x1: screenCoordinates.x - startDelta.x1,
        x2: screenCoordinates.x - startDelta.x2,
        y1: screenCoordinates.y - startDelta.y1,
        y2: screenCoordinates.y - startDelta.y2
      }
      
      section.updateSelectRectangle(rectangle)
    }

    if (event.dragType === 'end') {
      brushing = false
      blockReindexing = false
    }
  }
</script>

<Graphic width={500} height={500}>

  <Section
    bind:this={section}
    padding={30}
    scaleX={scale}
    scaleY={scale}
    flipY
    {onMousedown}
    {onMousemove}
    {onMouseup}
  >

    <PointLayer 
      x={data.column('a')}
      y={data.column('b')}
      fill={key => selectedPoints[key] ? 'red' : 'steelblue'}
      onSelect={selectPoint}
      onDeselect={deselectPoint}
    />

    <XAxis />
    <YAxis />
  
  </Section>

  {#if rectangle}

    <Rectangle 
      {...rectangle}
      fill="yellow"
      opacity={0.2}
      {onMousedrag}
      {blockReindexing}
    />

  {/if}

</Graphic>

<br />

<h3>Average X: {averageA ? Math.round(averageA) : ''}</h3>
<h3>Average Y: {averageA ? Math.round(averageB) : ''}</h3>
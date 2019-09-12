<script>
  import { Graphic, Section, Rectangle, Line, FuncLine } from '../../../../src'
  import { scaleLinear } from 'd3-scale'

  // Rectangle
  let rectanglePosition = { x: 1, y: 1 }
  let rectangleWH = { w: 2, h: 2 }

  $: rectangleCoords = {
    x1: rectanglePosition.x, 
    y1: rectanglePosition.y, 
    x2: rectanglePosition.x + rectangleWH.w,
    y2: rectanglePosition.y + rectangleWH.h
  }

  let rectStartDelta

  function handleStartRectangle ({ localCoordinates }) {
    rectStartDelta = { 
      x: localCoordinates.x - rectanglePosition.x,
      y: localCoordinates.y - rectanglePosition.y
    }
  }

  function handleDragRectangle ({ localCoordinates }) {
    rectanglePosition = {
      x: localCoordinates.x - rectStartDelta.x,
      y: localCoordinates.y - rectStartDelta.y
    }
  }

  // Line
  let lineBaseX = new Array(10).fill(0).map(_ => Math.round(Math.random() * 10))
  let lineBaseY = new Array(10).fill(0).map(_ => Math.round(Math.random() * 10))

  let previousLinePosition
  let currentLinePosition
  let lineOffset = { x: 0, y: 0 }

  function handleStartLine ({ localCoordinates }) {
    currentLinePosition = localCoordinates
  }

  function handleDragLine ({ localCoordinates }) {
    previousLinePosition = currentLinePosition
    currentLinePosition = localCoordinates
    lineOffset = {
      x: lineOffset.x + (currentLinePosition.x - previousLinePosition.x),
      y: lineOffset.y + (currentLinePosition.y - previousLinePosition.y)
    }
  }

  $: lineCoords = {
    x: lineBaseX.map(x => x + lineOffset.x),
    y: lineBaseY.map(y => y + lineOffset.y)
  }

  // FuncLine
  let baseA = 1
  $: func = x => Math.sin(x) * 2 + baseA

  let previousY
  let currentY

  function handleStartFuncLine ({ localCoordinates }) {
    currentY = localCoordinates.y
  }

  function handleDragFuncLine ({ localCoordinates }) {
    previousY = currentY
    currentY = localCoordinates.y
    baseA = baseA + (currentY - previousY)
  }
</script>

<Graphic width={500} height={500}>

  <Section 
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
  >
  
    <Rectangle 
      {...rectangleCoords} 
      fill="green"
      onDragstart={handleStartRectangle}
      onDrag={handleDragRectangle}
    />

    <Line
      {...lineCoords}
      strokeWidth={6}
      stroke="red"
      onDragstart={handleStartLine}
      onDrag={handleDragLine}
    />
    
    <FuncLine
      {func}
      stroke="blue"
      strokeWidth={8}
      onDragstart={handleStartFuncLine}
      onDrag={handleDragFuncLine}
    />

  </Section>

</Graphic>
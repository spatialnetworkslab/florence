export default function createDragHandler (onDrag, setBlockReindexing) {
  let dragging = false

  const start = function (event) {
    setBlockReindexing(true)
    dragging = true
  }

  const handler = function (event) {
    if (!dragging) return

    // TODO
  }

  const end = function (event) {
    setBlockReindexing(false)
    dragging = false
  }

  return {
    applyHandlers () {
      return {
        onMousedown: start,
        onMousemove: handler,
        onMouseup: end
      }
    }
  }
}

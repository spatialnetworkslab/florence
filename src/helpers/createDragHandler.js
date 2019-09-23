export default function createDragHandler (
  { onDragstart = () => {}, onDrag = () => {}, onDragend = () => {} },
  setBlockReindexing
) {
  let dragging = false

  const start = function (event) {
    setBlockReindexing(true)
    dragging = true
    onDragstart(event)
  }

  const handler = function (event) {
    if (!dragging) return

    onDrag(event)
  }

  const end = function (event) {
    if (!dragging) return

    setBlockReindexing(false)
    dragging = false
    onDragend(event)
  }

  return {
    markHandlers: {
      onMousedown: start
    },

    sectionHandlers: {
      onMousemove: handler,
      onMouseup: end
    }
  }
}

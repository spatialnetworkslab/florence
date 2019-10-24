<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let independentAxis = undefined
 
  // Aesthetics: other
  export let fill = undefined
  export let strokeWidth = undefined
  export let stroke = undefined
  export let fillOpacity = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onDragstart = undefined
  export let onDrag = undefined
  export let onDragend = undefined

  // Other
  export let interpolate = true
  export let zoomIdentity = undefined
</script>

<Mark 
  type="Area"
  {x1} {x2} {y1} {y2} {independentAxis}
  {fill} {strokeWidth} {stroke} {fillOpacity} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {onDragstart} {onDrag} {onDragend}
  {interpolate} {zoomIdentity}
/>
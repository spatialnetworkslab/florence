<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let strokeWidth = undefined
  export let stroke = undefined
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
  type="Line"
  {x} {y} {geometry}
  {strokeWidth} {stroke} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {onDragstart} {onDrag} {onDragend}
  {interpolate} {zoomIdentity} _asPolygon={false}
/>
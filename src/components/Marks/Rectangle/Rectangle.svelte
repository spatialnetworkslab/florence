<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  // Aesthetics: other
  export let fill = undefined
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousedrag = undefined

  // Other
  export let interpolate = true
  export let zoomIdentity = undefined
  export let blockReindexing = false
</script>

<Mark
  type="Rectangle"
  {x1} {x2} {y1} {y2}
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {transition} 
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {zoomIdentity} {interpolate} {blockReindexing}
/>
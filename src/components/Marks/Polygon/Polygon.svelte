<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

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
  export let onHover = undefined
  export let onMouseout = undefined

  // Other
  export let interpolate = false
  export let zoomIdentity = undefined
</script>

<Mark
  type="Polygon"
  {x} {y} {geometry}
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {transition} {onClick} {onHover} {onMouseout}
  {interpolate} {zoomIdentity}
/>
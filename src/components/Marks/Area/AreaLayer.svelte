<script>
  import Mark from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let independentAxis = undefined

  // Aesthetics: other
  export let fill = undefined
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = undefined

  // Transitions
  export let transition = undefined

  // Mouse interactions
  export let onClick = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousedrag = undefined

  // Touch interactions
  export let onTouchdown = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined
  export let onTouchdrag = undefined

  // Select interactions
  export let onSelect = undefined
  export let onDeselect = undefined

  // Other
  export let key = undefined
  export let renderSettings = undefined
  export let blockReindexing = false
  export let clip = true
</script>

<Mark 
  type="Area"
  {x1} {x2} {y1} {y2} {independentAxis}
  {fill} {stroke} {strokeWidth} 
  {strokeOpacity} {fillOpacity} {opacity}
  {transition}
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onTouchdown} {onTouchup} {onTouchover} {onTouchout} {onTouchdrag}
  {onSelect} {onDeselect}
  {key} {renderSettings} {blockReindexing} {clip}
  _asPolygon={false}
/>
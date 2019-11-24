<script>
  import Mark from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x1
  export let x2
  export let y1
  export let y2
  export let independentAxis

  // Aesthetics: other
  export let fill
  export let stroke
  export let strokeWidth
  export let strokeOpacity
  export let fillOpacity
  export let opacity

  // Transitions
  export let transition

  // Mouse interactions
  export let onClick
  export let onMousedown
  export let onMouseup
  export let onMouseover
  export let onMouseout
  export let onMousedrag

  // Touch interactions
  // TODO

  // Select interactions
  export let onSelect
  export let onDeselect

  // Other
  export let key
  export let interpolate = true
  export let zoomIdentity
  export let blockReindexing = false
</script>

<Mark 
  type="Area"
  {x1} {x2} {y1} {y2} {independentAxis}
  {fill} {stroke} {strokeWidth} 
  {strokeOpacity} {fillOpacity} {opacity}
  {transition}
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onSelect} {onDeselect}
  {key} {interpolate} {zoomIdentity} {blockReindexing}
/>
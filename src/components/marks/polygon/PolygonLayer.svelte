<script>
  import { createPolygonLayer, parseAestheticsPolygonLayer } from '@snlab/rendervous'
  import Layer from '../base/Layer.svelte'

  // Positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics
  export let fill = undefined
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = undefined
  export let lineCap = undefined
  export let lineJoin = undefined
  export let miterLimit = undefined
  export let dashArray = undefined
  export let dashOffset = undefined

  // Other
  export let outputSettings = undefined
  export let clip = undefined
  export let keys = undefined
  export let asOnePath = undefined
  export let blockReindexing = undefined

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

  $: positioning = { x, y, geometry }

  $: aesthetics = {
    fill, stroke, strokeWidth,
    strokeOpacity, fillOpacity, opacity,
    lineCap, lineJoin, miterLimit, dashArray, dashOffset, clip,
    keys, asOnePath
  }
</script>

<Layer
  {positioning}
  {aesthetics}
  createLayer={createPolygonLayer}
  parseAesthetics={parseAestheticsPolygonLayer}
  className="polygon-layer"
  {outputSettings}
  {blockReindexing}
  {onClick}
  {onMousedown}
  {onMouseup}
  {onMouseover}
  {onMouseout}
  {onMousedrag}
  {onTouchdown}
  {onTouchup}
  {onTouchover}
  {onTouchout}
  {onTouchdrag}
  {onSelect}
  {onDeselect}
/>
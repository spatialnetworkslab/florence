<script>
  import { createLine, parseAestheticsLine } from '@snlab/rendervous'
  import Mark from '../base/Mark.svelte'

  // Positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
  export let curve = undefined
  export let _resampleIntervals = undefined

  // Aesthetics
  export let stroke = undefined
  export let strokeWidth = undefined
  export let opacity = undefined
  export let lineCap = undefined
  export let lineJoin = undefined
  export let miterLimit = undefined
  export let dashArray = undefined
  export let dashOffset = undefined

  // Other
  export let outputSettings = undefined
  export let clip = undefined

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

  $: positioning = { x, y, geometry, curve, _resampleIntervals }

  $: aesthetics = {
    stroke, strokeWidth, opacity,
    lineCap, dashArray, lineJoin, miterLimit, dashOffset, clip
  }
</script>

<Mark
  {positioning}
  {aesthetics}
  createMark={createLine}
  parseAesthetics={parseAestheticsLine}
  className="line"
  {outputSettings}
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
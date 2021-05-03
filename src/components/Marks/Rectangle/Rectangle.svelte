<script>
  import { createRectangle, parseAestheticsRectangle } from '@snlab/rendervous'
  import Mark from '../Base/Mark.svelte'

  // Positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

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

  $: positioning = { x1, x2, y1, y2 }

  $: aesthetics = {
    fill, stroke, strokeWidth,
    strokeOpacity, fillOpacity, opacity,
    lineCap, lineJoin, miterLimit, dashArray, dashOffset, clip
  }

  let mark

  // Handling prop updates
  $: { if (positioning) { mark.scheduleUpdatePositioning() } }
  $: { if (aesthetics) { mark.scheduleUpdateAesthetics() } }
</script>

<Mark
  {positioning}
  {aesthetics}
  bind:this={mark}
  createMark={createRectangle}
  parseAesthetics={parseAestheticsRectangle}
  className="rectangle"
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
<script>
  import { createLabel, parseAestheticsLabel } from '@snlab/rendervous'
  import Mark from '../base/Mark.svelte'

  // Positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
  export let rotate = undefined
  export let anchorPoint = undefined

  // Aesthetics
  export let text = undefined
  export let fontSize = undefined
  export let fontFamily = undefined
  export let fontWeight = undefined
  export let fill = undefined
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = undefined

  // Other
  export let outputSettings = undefined
  export let clip = undefined
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

  $: positioning = { x, y, geometry, rotate, anchorPoint, text, fontSize }

  $: aesthetics = {
    anchorPoint, text, fontSize, fontFamily, fontWeight,
    fill, stroke, strokeWidth,
    strokeOpacity, fillOpacity, opacity,
    clip
  }
</script>

<Mark
  {positioning}
  {aesthetics}
  createMark={createLabel}
  parseAesthetics={parseAestheticsLabel}
  className="label"
  element="text"
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
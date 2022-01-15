<script context="module">
  let idCounter = 0

  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import { createSection } from '@snlab/rendervous'
  import BaseSection from '../_BaseSection.svelte'

  const id = getId()

  // Positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  // Aesthetics
  export let backgroundColor = undefined

  // Local coordinates
  export let coordinates = undefined
  export let scaleX = undefined
  export let scaleY = undefined
  export let flipX = false
  export let flipY = false
  export let padding = 0

  // Zooming and panning
  export let pannable = false
  export let zoomable = false
  export let zoomPanSettings = undefined

  // Mouse interactions
  export let onClick = undefined
  export let onWheel = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousemove = undefined

  // Touch interactions
  export let onPinch = undefined
  export let onTouchdown = undefined
  export let onTouchmove = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined

  // Other options
  export let clip = 'padding'

  $: props = {
    x1, x2, y1, y2,
    coordinates, scaleX, scaleY, flipX, flipY, padding,
    clip
  }

  // Expose instance methods 
  let node

  export const selectRectangle = rect => node.getSM().selectRectangle(rect)
  export const updateSelectRectangle = rect => node.getSM().updateSelectRectangle(rect)
  export const resetSelectRectangle = () => node.getSM().resetSelectRectangle()
  export const startSelectPolygon = c => node.getSM().startSelectPolygon(c)
  export const addPointToSelectPolygon = c => node.getSM().addPointToSelectPolygon(c)
  export const moveSelectPolygon = delta => node.getSM().moveSelectPolygon(delta)
  export const getSelectPolygon = () => node.getSM().getSelectPolygon()
  export const resetSelectPolygon = () => node.getSM().resetSelectPolygon()

  export const startZoomPan = () => node.startZoomPan()
  export const setZoomIdentity = newZoomIdentity => node.setZoomIdentity(newZoomIdentity)
  export const endZoomPan = () => node.endZoomPan()
  export const getZoomIdentity = () => node.getZoomIdentity()
</script>

<BaseSection
  bind:this={node}
  {props}
  {backgroundColor}
  {id}
  createFunction={createSection}
  {pannable}
  {zoomable}
  {zoomPanSettings}
  {onClick}
  {onWheel}
  {onMousedown}
  {onMouseup}
  {onMouseover}
  {onMouseout}
  {onMousemove}
  {onPinch}
  {onTouchdown}
  {onTouchmove}
  {onTouchup}
  {onTouchover}
  {onTouchout}
>

  <slot />

</BaseSection>
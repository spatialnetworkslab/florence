<script context="module">
  let idCounter = 0

  function getId () {
    return 'psc' + idCounter++
  }
</script>

<script>
  import { createPointSection } from '@snlab/rendervous'
  import BaseSection from '../_BaseSection.svelte'

  const id = getId()

  // Positioning
  export let x
  export let y
  export let width
  export let height

  // Aesthetics
  export let backgroundColor = undefined

  // Local coordinates
  export let coordinates = undefined
  export let scaleX = undefined
  export let scaleY = undefined
  export let flipX = false
  export let flipY = false
  export let padding = 0
  export let zoomIdentity = undefined

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
    x, y, width, height,
    coordinates, scaleX, scaleY, flipX, flipY, padding, zoomIdentity,
    clip
  }

  let node

  export const selectRectangle = rect => node.getSM().selectRectangle(rect)
  export const updateSelectRectangle = rect => node.getSM().updateSelectRectangle(rect)
  export const resetSelectRectangle = () => node.getSM().resetSelectRectangle()
  export const startSelectPolygon = c => node.getSM().startSelectPolygon(c)
  export const addPointToSelectPolygon = c => node.getSM().addPointToSelectPolygon(c)
  export const moveSelectPolygon = delta => node.getSM().moveSelectPolygon(delta)
  export const getSelectPolygon = () => node.getSM().getSelectPolygon()
  export const resetSelectPolygon = () => node.getSM().resetSelectPolygon()
</script>

<BaseSection
  bind:this={node}
  {props}
  {backgroundColor}
  {id}
  createFunction={createPointSection}
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

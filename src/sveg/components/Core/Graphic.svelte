<script>
  import  { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey } from '../contextKeys.js'
  import CoordinateContext from '../../classes/CoordinateContext'

  export let width
  export let height

  export let scaleX = undefined
  export let scaleY = undefined

  $: rangeX = [0, width]
  $: rangeY = [0, height]

  const coordinateContext = writable()

  setContext(coordinateContextKey, coordinateContext)

  $: {
    coordinateContext.set(new CoordinateContext({ rangeX, rangeY, scaleX, scaleY }))
  }
</script>

<svg {width} {height}>
  <slot />
</svg>
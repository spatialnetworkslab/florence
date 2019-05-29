<script>
  import  { setContext } from 'svelte'
  import { coordinateContextKey } from '../../contextKeys.js'
  import CoordinateContext from '../../../classes/CoordinateContext'

  export let width
  export let height

  const rangeX = [0, width]
  const rangeY = [0, height]

  const coordinateContext = new CoordinateContext({ rangeX, rangeY })

  setContext(coordinateContextKey, coordinateContext)
</script>

<svg {width} {height}>
  <slot />
</svg>
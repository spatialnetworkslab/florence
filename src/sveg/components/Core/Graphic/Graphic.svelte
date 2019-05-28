<script>
    import  { setContext } from 'svelte'
    import { coordinateContextKey } from '../../contextKeys.js'
    import CoordinateContext from '../../../classes/CoordinateContext'

    export let width
    export let height

    const coordinateContext = new CoordinateContext({
      rangeX: [0, width],
      rangeY: [0, height]
    })

    setContext(coordinateContextKey, coordinateContext)
</script>

<svg {width} {height}>
    <slot />
</svg>
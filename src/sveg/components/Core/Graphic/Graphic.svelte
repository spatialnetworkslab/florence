<script>
    import  { setContext } from 'svelte'
    import { coordinateContextKey } from '../contextKey.js'
    import CoordinateContext from '../classes/CoordinateContext'

    export let width
    export let height

    const coordinateContext = new CoordinateContext()

    setContext(coordinateContextKey, coordinateContext)
</script>

<svg {width} {height}>
    <slot />
</svg>
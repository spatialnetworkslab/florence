<script>
  import { getContext, setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import TransformationContext from '../../classes/TransformationContext'

  export let transformation

  if (getContext(transformationContextKey)) throw new Error('Cannot nest CoordinateTransformation components')

  let coordinateContext

  const unsubscribeCoordinateContext = getContext(coordinateContextKey)
    .subscribe(ctx => {
    coordinateContext = ctx
  })

  let transformationContext = writable()

  setContext(transformationContextKey, transformationContext)

  $: {
    let rangeX = coordinateContext.rangeX()
    let rangeY = coordinateContext.rangeY()
    transformationContext.set(new TransformationContext({ rangeX, rangeY, transformation }))
  }

  onDestroy(unsubscribeCoordinateContext)
</script>

<slot />
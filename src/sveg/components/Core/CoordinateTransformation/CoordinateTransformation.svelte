<script>
  import * as SectionContext from '../Section/SectionContext'
  import *  as CoordinateTransformationContext from './CoordinateTransformationContext'

  export let transformation

  CoordinateTransformationContext.ensureNotNested()

  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.init()

  $: {
    let rangeX = $sectionContext.rangeX()
    let rangeY = $sectionContext.rangeY()
    CoordinateTransformationContext.update(coordinateTransformationContext, { rangeX, rangeY, transformation })
  }
</script>

<slot />
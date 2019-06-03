<script>
  import * as SectionContext from '../Section/SectionContext'

  export let width
  export let height
  export let scaleX = undefined
  export let scaleY = undefined

  const sectionContext = SectionContext.init()

  $: {
    let rangeX = [0, width]
    let rangeY = [0, height]
    SectionContext.update(sectionContext, { rangeX, rangeY, scaleX, scaleY })
  }
</script>

<svg {width} {height}>
  <slot />
</svg>
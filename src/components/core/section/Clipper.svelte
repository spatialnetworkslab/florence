<script>
  import { bboxToClipRect } from '@snlab/rendervous'

  export let section

  $: paddingClipId = `clip-padding-${section.id}`
  $: paddingClipRect = bboxToClipRect(section.paddedBbox)
  $: outerClipId = `clip-outer-${section.id}`
  $: outerClipRect = bboxToClipRect(section.bbox)
</script>

<clipPath id={paddingClipId}>
  <rect {...paddingClipRect} />
</clipPath>

<clipPath id={`clip-${outerClipId}`}>
  <rect {...outerClipRect} />
</clipPath>

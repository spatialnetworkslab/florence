<script>
  import { bboxToClipRect } from '@snlab/rendervous'

  export let section

  const paddingClipId = `clip-padding-${section.id}`
  const paddingClipRect = bboxToClipRect(section.paddedBbox)
  const outerClipId = `clip-outer-${section.id}`
  const outerClipRect = bboxToClipRect(section.bbox)
</script>

<clipPath id={paddingClipId}>
  <rect {...paddingClipRect} />
</clipPath>

<clipPath id={`clip-${outerClipId}`}>
  <rect {...outerClipRect} />
</clipPath>

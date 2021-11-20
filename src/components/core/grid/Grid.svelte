<script>
  import { getContext } from 'svelte'
  import { getGridCells } from '@snlab/rendervous'
  import Section from '../section/Section.svelte'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let padding = undefined
  export let numberOfCells
  export let rows = undefined
  export let columns = undefined

  // Contexts
  const parentSection = getContext('section')

  $: cells = getGridCells({
    numberOfCells,
    rows,
    columns
  }, $parentSection)
</script>

<Section {x1} {x2} {y1} {y2} {padding}>

  <slot {cells} />

</Section>

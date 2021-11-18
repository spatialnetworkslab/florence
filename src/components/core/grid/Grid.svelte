<script>
  import { getContext } from 'svelte'
  import { getGridCells } from '@snlab/rendervous'
  import Section from '../section/Section.svelte'

  // Props
  export let numberOfCells
  export let rows = undefined
  export let columns = undefined

  // Contexts
  const parentSection = getContext('section')

  $: cells = getGridCells({
    numberOfCells,
    rows,
    columns
  }, parentSection)
</script>

<Section>

  <slot {cells} />

</Section>

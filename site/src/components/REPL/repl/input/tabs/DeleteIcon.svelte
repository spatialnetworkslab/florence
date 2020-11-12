<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let visible

  let min = 6
  let max = 18
</script>

<style>
  .edit-icon {
    cursor: pointer;
    stroke: #999
  }

  .edit-icon:hover {
    stroke: blue;
  }
</style>

<svg 
  width={12}
  height={12}
  class="edit-icon"
  viewbox="0 -2 24 22"
  on:click={e => { e.stopPropagation(); dispatch('click') }}
>
  {#if visible}
    <line x1={max} y1={min} x2={min} y2={max} stroke-width={4} />
		<line x1={min} y1={min} x2={max} y2={max} stroke-width={4} />
  {/if}
</svg>
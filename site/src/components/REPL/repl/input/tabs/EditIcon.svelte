<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let visible
</script>

<style>
  .edit-icon {
    cursor: pointer;
    fill: #999
  }

  .edit-icon:hover {
    fill: blue;
  }
</style>

<svg 
  width={12}
  height={12}
  class="edit-icon"
  viewbox="-4 -4 28 28"
  on:click={e => { e.stopPropagation(); dispatch('click') }}
>
  {#if visible}
    <path
      class="edit-icon-path"
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" 
    />
  {/if}
</svg>
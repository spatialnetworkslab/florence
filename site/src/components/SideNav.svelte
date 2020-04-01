<script>
    export let items
    let selected
</script>

<style>
  .sidenav-first{
    @apply text-lg no-underline;
  }
  .sidenav-second{
    @apply text-base font-normal pl-4;
  }
  .sidenav-second:hover {
    @apply text-indigo-500;
  }
  .sidenav-second-selected {
    @apply text-indigo-500 font-medium;
  }
  .sidenav-a{
    @apply no-underline;
  }
</style>

<nav>
  <ul class='flex-wrap'>
    {#each items as item, index}
      <li class='list-none sidenav-first'>
        {item.title}
      </li>
      
      {#if item.children}
        {#each item.children as child, index}
        <li class={`list-none sidenav-second
           ${selected === child.title + index
           ? 'sidenav-second-selected' : ''}`}>
            <a
              rel="prefetch"
              href={child.path}
              on:click={() => (selected = child.title + index)}
              class={'sidenav-a'}>
              {child.title} 
            </a>
        </li>
        {/each}
      {/if}
    {/each}
  </ul>
</nav>
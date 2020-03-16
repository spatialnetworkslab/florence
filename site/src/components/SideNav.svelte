<script>
    export let items

    let selected = 'CoreGraphic0'
</script>

<style>
.sidenav-first{
  @apply text-lg no-underline;
}

.sidenav-second{
  @apply text-base font-normal pl-4;
  transition: color 0.75s;
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
      <li class='list-none sidenav-first' 
        on:click={() => (selected = item.title)}>
        {item.title}
      </li>
      
      <div class='pb-2'>
        {#if item.children && selected.includes(item.title)}
          {#each item.children as child, index}
          <li class={`list-none sidenav-second
            ${selected === item.title + child.title + index
            ? 'sidenav-second-selected' : ''}`}>
              <a
                rel="prefetch"
                href={child.path}
                on:click={() => (selected = item.title + child.title + index)}
                class={'sidenav-a'}>
                {child.title} 
              </a>
          </li>
          {/each}
        {/if}
      </div>
    {/each}
  </ul>
</nav>
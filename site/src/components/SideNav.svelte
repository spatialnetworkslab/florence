<script>
    export let items
    export let selected
</script>

<style>
.sidenav-first{
  @apply text-lg no-underline;
}
.sidenav-second{
  @apply text-base font-normal pl-4;
}
.sidenav-second:hover {
  @apply text-red-500;
}
.sidenav-second-selected {
  @apply text-red-500 font-medium;
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
           ${selected === child.path
           ? 'sidenav-second-selected' : ''}`}>
            <a
              rel="prefetch"
              href={child.path}
              class={'sidenav-a'}>
              {child.title} 
            </a>
        </li>
        {/each}
      {/if}
    {/each}
  </ul>
</nav>
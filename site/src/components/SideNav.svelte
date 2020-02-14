<script>
    export let items

    let selected
</script>

<nav class='sidenav'>
  <ul>
    {#each items as item, index}
      <li class='nav-li sidenav-first'>
        {item.title}
      </li>
      
      {#if item.children}
        {#each item.children as child, index}
        <li class={`nav-li sidenav-second
           ${selected === child.title + index ? 
           'sidenav-second-selected': ''}`}>
            <a
              rel="prefetch"
              href={child.path}
              on:click={() => (selected = child.title + index)}
              class={`sidenav-a`}>
              {child.title} 
            </a>
        </li>
        {/each}
      {/if}
    {/each}
  </ul>
</nav>
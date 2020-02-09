<script>
    export let items

    let selected
</script>

<nav>
  <ul>
    {#each items as item, index}
      <li>
        {item.title}
      </li>
      
      {#if item.children}
        {#each item.children as child, index}
        <li>
            <a
                rel="prefetch"
                href={child.path}
                on:click={() => (selected = item.title + index)}
                class>
                {child.title}
            </a>
        </li>
        {/each}
      {/if}
    {/each}
  </ul>
</nav>
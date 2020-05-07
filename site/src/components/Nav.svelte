<script>
  export let segment
  
  // maybe export this out
  const links = [
    { name: 'Docs', link: 'docs' },
    { name: 'Examples', link: 'examples' },
    { name: 'Tutorials', link: 'tutorials' }
    // { name: 'Inspiration', link: 'inspiration' }
  ]
</script>

<style>
/* nav bars */

.selected {
  @apply relative border-b-2 border-red-600 no-underline;
}

.top-nav {
  @apply h-full py-2 px-4 w-screen border-b border-gray-200 bg-white;
}

.nav-li {
  @apply list-none;
}

.nav-a {
  @apply no-underline py-1 px-0 mr-4 font-normal text-black;
  transition: border-color 1s; 
}

.nav-a:hover {
  @apply border-b-2 border-red-600;
}

@screen md {
  ul {
    @apply ml-0;
  }
}
</style>

<nav class='top-nav'>
	<ul class='ml-8 flex flex-row mb-0'>
    <li class='nav-li'>
      <a class={`nav-a ${segment ===
        undefined ? 'selected' : ''}`} href='.'>Home</a></li>

    {#each links as item, index}
      <li class='nav-li'><a class={`nav-a 
        ${segment === item.link ? 'selected' : ''}`} 
        href={item.link}> {item.name} </a> </li>
    {/each}
  </ul>
</nav>
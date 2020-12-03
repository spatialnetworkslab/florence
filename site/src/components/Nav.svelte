<script>
  export let segment
  
  // maybe export this out
  const links = [
    { name: 'Examples', link: 'examples' },
    { name: 'Tutorials', link: 'tutorials' },
    { name: 'Docs', link: 'docs' },
    { name: 'Install', link: 'install' },
    { name: 'About', link: 'about' }
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

.nav-a.gitlab {
  @apply no-underline py-1 px-0 mr-4 font-normal text-gray-400;
}

.nav-a:hover {
  @apply border-b-2 border-red-600;
}

.nav-a.home {
  @apply font-semibold;
}

@screen md {
  ul {
    @apply ml-0;
  }
}
</style>

<nav class='top-nav'>
	<ul class='ml-8 flex flex-row justify-between mb-0'>
    <div class='left-nav flex flex-row'>
      <li class='nav-li'>
        <a class={`nav-a home ${segment ===
          undefined ? 'selected' : ''}`} href='.'>Florence</a></li>

      {#each links as item, index}
        <li class='nav-li'><a class={`nav-a 
          ${segment === item.link ? 'selected' : ''}`} 
          href={item.link}> {item.name} </a> </li>
      {/each}
    </div>
    <div class='right-nav flex flex-row'>
    <li class='nav-li self-end'>
      <a class='nav-a' href='/repl'>REPL</a>
    </li>
    <li class='nav-li self-end'>
      <a class='nav-a gitlab' href='https://gitlab.com/spatialnetworkslab/florence'>Source Code</a>
    </li>
    </div>
  </ul>
</nav>
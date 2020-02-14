<script>
	export let segment

  // maybe export this out
  let links = [
    {'name': 'Gallery', 'link': 'gallery'},
    {'name': 'Docs', 'link': 'docs'},
    {'name': 'Inspiration', 'link': 'inspiration'},
  ]
</script>

<style>
</style>

<nav>
	<ul class='nav-ul text-sm sm:text-sm md:text-base'>
    <li class='nav-li'>
      <a class={`nav-a ${segment === 
        undefined ? "selected" : ""}`} href='.'>Home</a></li>

    {#each links as item, index}
      <li class='nav-li'><a class={`nav-a 
        ${segment === item.link ? "selected" : ""}`} 
        href={item.link}> {item.name} </a> </li>
    {/each}
  </ul>
</nav>
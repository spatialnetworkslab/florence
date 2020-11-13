<script context="module">
  export async function preload () {
    const res = await this.fetch('docs.json')
    const items = await res.json()
    if (res.status === 200) {
      return { items }
    } else {
      this.error(res.status, items.message)
    }
  }
</script>

<script>
  import SideNav from '../../components/SideNav.svelte'
	export let items
	let openMenu = false
</script>

<div on:click={() => openMenu ^= true} class="hamburger">
	<button class="md:hidden mb-4 mr-4 p-2 border rounded border-teal-light">
		<svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
	</button>
</div>
<div class="content">
	<div class:openMenu class="left-col cols md:flex hidden">
		<SideNav { items }/>
	</div>
	<div class="right-col cols">
		<main>
			<slot></slot>
		</main>
	</div>
</div>

<style>
.openMenu {
	@apply block absolute h-full bg-white;
}
.hamburger {
	@apply absolute top-0 left-0 pl-1 pt-1;
}
</style>


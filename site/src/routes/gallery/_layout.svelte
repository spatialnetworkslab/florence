<script context="module">
  export async function preload () {
    const res = await this.fetch('gallery.json')
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
</script>

<div class="content">
	<div class="left-col cols">
		<SideNav { items }/>
	</div>
	<div class="right-col cols">
		<main>
			<slot></slot>
		</main>
	</div>
</div>


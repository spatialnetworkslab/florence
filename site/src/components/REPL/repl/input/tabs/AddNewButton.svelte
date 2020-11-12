<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
</script>

<style>
  .add-new {
    cursor: pointer;
    /* padding-left: 20px; */
    display: inline-block;
    position: relative;
    line-height: 1;
    /* border-left: 2px #dddddd solid; */
	}

  svg {
		position: relative;
		overflow: hidden;
		vertical-align: middle;
		-o-object-fit: contain;
		object-fit: contain;
		-webkit-transform-origin: center center;
		transform-origin: center center;

		stroke: #999;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
  }
  
  svg:hover {
    stroke: blue;
  }
</style>

<div
  class="add-new"
>

	<svg 
    width="20"
    height="20"
    viewBox="0 0 24 24"
    on:click={e => { dispatch('click', e) }}
  >

		<line x1='12' y1='5' x2='12' y2='19' />
		<line x1='5' y1='12' x2='19' y2='12' />

	</svg>

</div>
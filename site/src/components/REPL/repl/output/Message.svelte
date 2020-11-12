<script>
	import { slide } from 'svelte/transition'

	export let kind
	export let details = null
  export let truncate = false
</script>

<style>
	.message {
		position: relative;
		color: white;
		padding: 12px 16px 12px 44px;
		font: 400 12px/1.7 var(--font);
		margin: 0;
		border-top: 1px solid white;
	}

	.message::before {
		content: '!';
		position: absolute;
		left: 12px;
		top: 10px;
		text-align: center;
		line-height: 1;
		padding: 4px;
		border-radius: 50%;
		color: white;
		border: 2px solid white;
		box-sizing: content-box;
		width: 10px;
		height: 10px;
		font-size: 11px;
		font-weight: 700;
	}

	.truncate {
		white-space: pre;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	p {
		margin: 0;
	}

	.error {
		background-color: #da106e;
	}

	.warning {
		background-color: #e47e0a;
	}

	.info {
		background-color: #a3a292;
	}
</style>

<div 
  in:slide={{delay: 150, duration: 100}}
  out:slide={{duration: 100}}
  class="message {kind}"
  class:truncate
>
	
  {#if details}
		
    <p>
     {#each details.message.split('\n') as line}
      {line} <br />
     {/each}
    </p>

	{:else}

		<slot />

	{/if}

</div>
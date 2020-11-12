<script>
  import srcdoc from './srcdoc.js'
  import Message from './Message.svelte'

  export let bundled
  export let error
  export let bundling

	let iframe

	function update (code) {
		iframe.contentWindow.postMessage(code, "*")
	}

  $: iframe && bundled && update(bundled)
</script>

<style>
	.iframe-container {
		border: none;
		width: 100%;
		height: 100%;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}

	/* .greyed-out {
		filter: grayscale(50%) blur(1px);
		opacity: .25;
	}

	button {
		color: #999;
		font-size: 12px;
		text-transform: uppercase;
		display: block;
	}

	button:hover {
		color: #333;
	} */

	.overlay {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
</style>

<section class="iframe-container">
  <iframe 
    title="Rendered REPL"
    bind:this={iframe}
    {srcdoc} 
  />

  <!-- <div class="overlay">
		{#if error}
			<Message kind="error" details={error}/>
		{:else if status || !bundled}
			<Message kind="info" truncate>{status || 'loading Svelte compiler...'}</Message>
		{/if}
	</div> -->
  <div class="overlay">
		{#if error}
			<Message kind="error" details={error} />
		{/if}

    {#if bundling}
      <Message kind="info" details={{ message: 'Bundling...' }} />
    {/if}
	</div>

</section>

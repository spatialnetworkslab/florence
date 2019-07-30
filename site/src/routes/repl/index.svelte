<script>
	import ReplPreprocess from '../../components/ReplWrapper.svelte'
	let title = 'Hello World';
	const code_1 = `<script>import Component from './Component.svelte'<\/script>
<Component />`
	const code_2 = `<script>
	let variable = 'I am a regular svelte component'
<\/script>
{ variable }`
	let name = 'loading...';
	let width = process.browser
		? window.innerWidth - 32
		: 1000;
	let components = [
		{
			type: "svelte",
			name: "App",
			source: code_1
		},
		{
			type: "svelte",
			name: "Component",
			source: code_2
		},
	]
</script>

<style>
	input {
		background: none;
		border: none;
		font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
		font-size: 16px;
		padding-left: 8px;
		color: lightgray;
	}
	.header {
		width: 100%;
		background: #535963;
		padding: 1em 3em;
	}
</style>

<div class="header">
	<input value={title}>
</div>
<ReplPreprocess {components} {width} />
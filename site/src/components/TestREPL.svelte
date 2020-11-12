<script>
  import { REPL } from './REPL/index.js'

  const replFiles = [
    {
      id: 0,
      name: 'App',
			type: 'svelte',
			source: '<h1>Hello world!</h1>',
    }
  ]
  
  const width = 500
  const height = 300
</script>

<REPL 
  {replFiles}
  {width}
  {height}
/>
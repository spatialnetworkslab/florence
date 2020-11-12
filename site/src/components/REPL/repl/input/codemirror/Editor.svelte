<script>
  import CodeMirror from './codemirror.js'
  import { onMount, createEventDispatcher } from 'svelte'
  import { createCodemirrorOptions } from './createCodemirrorOptions.js'
  import { sleep } from '../../../utils/sleep.js'
  
  const dispatch = createEventDispatcher()

  export let currentFile

  // Option props
	export let readonly = false
	// export let errorLoc = null
	export let lineNumbers = true
  export let tab = true
  export let height
  
  // Reference to <textarea> HTML element
  let textArea

  // State for lifecycle management
  let firstUpdate = true
  let mounted = false
  let destroyed = false
  let updatingExternally = false

  // Stuff related to 'markers' and errors (not sure what this does)
  // let marker
  // let errorLine
  // let previousErrorLine

  // Editor
  let editor

  // Store current type and state to avoid unnecessary updates
  let code
  let type

  // Cursor position
  let cursorPosition = { line: 0, ch: 0 }

  // Set destroyed to true when component is destroyed
  onMount(async () => {
    type = currentFile.type
    await createEditor()
    editor.setSize(null, height)
    updateExternal()

    mounted = true

		return () => {
			destroyed = true;
			if (editor) editor.toTextArea()
		}
  })

  // Convenience function to create editors
  async function createEditor () {
    if (destroyed) return

		if (editor) editor.toTextArea()

    // Creating a text editor is a lot of work, so we yield
		// the main thread for a moment. This helps reduce jank
		if (firstUpdate) await sleep(50)

		if (destroyed) return

    const options = createCodemirrorOptions(
      lineNumbers,
      type,
      readonly,
      tab
    )

		editor = CodeMirror.fromTextArea(textArea, options);

    // if text in editor changes...
		editor.on('change', instance => {
      // editor.setSize(null, height)
      // Skip dispatch if the update is external
      // Avoids infinite loop
			if (!updatingExternally) {
        const newCode = instance.getValue()
        
        if (newCode !== code) {
          code = newCode
          dispatch('change', newCode)
        }
			}
		})

    if (firstUpdate) await sleep(50)

		editor.refresh()

		firstUpdate = false
  }

  // Handle updates to height
  $: { editor && editor.setSize(null, height) }

  // Handle external changes to current file
  $: {
    if (mounted) updateExternal(currentFile)
  }

  async function updateExternal () {
    updatingExternally = true
            
    if (type !== currentFile.type) {
      type = currentFile.type
      await createEditor()
    }

    if (code !== currentFile.source) {
      code = currentFile.source
      editor.setValue(currentFile.source)
    }

    updatingExternally = false
  }

  // Something with the errors and markers again
  // $: {
	// 	if (marker) marker.clear()

	// 	if (errorLoc) {
	// 		const line = errorLoc.line - 1
	// 		const ch = errorLoc.column

	// 		marker = editor.markText({ line, ch }, { line, ch: ch + 1 }, {
	// 			className: 'error-loc'
	// 		})

	// 		errorLine = line
	// 	} else {
	// 		errorLine = null
	// 	}
	// }

	// $: if (editor) {
	// 	if (previousErrorLine !== null) {
	// 		editor.removeLineClass(previousErrorLine, 'wrap', 'error-line')
	// 	}

	// 	if (errorLine && (errorLine !== previousErrorLine)) {
	// 		editor.addLineClass(errorLine, 'wrap', 'error-line')
	// 		previousErrorLine = errorLine
	// 	}
	// }
</script>

<style>
	.codemirror-container {
    line-height: 1.5;
    font-family: "Courier New";
  }

	textarea {
		visibility: hidden;
	}
</style>

<div class="codemirror-container">

  <!-- svelte-ignore a11y-positive-tabindex -->
	<textarea
		tabindex='2'
		bind:this={textArea}
		readonly
	/>

</div>

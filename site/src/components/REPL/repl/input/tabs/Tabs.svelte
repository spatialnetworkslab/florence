<script>
  import AddNewButton from './AddNewButton.svelte'
  import Tab from './Tab.svelte'
  import getFileName from '../../../utils/getFileName.js'

  export let replFiles
  export let currentFileId

  $: usedFileNames = new Set(replFiles.map(getFileName))
  
  function addNew () {
    const maxId = Math.max(...replFiles.map(f => f.id))
    currentFileId = maxId + 1

    let counter = 1

    while (usedFileNames.has(`Component${counter}.svelte`)) {
      counter++ 
    }

    replFiles.push({
      id: currentFileId,
      name: `Component${counter}`,
      type: 'svelte',
      source: ''
    })

    replFiles = replFiles
  }

  function select (e) { currentFileId = e.detail }

  function remove (e) {
    const fileToBeRemoved = e.detail

    if (currentFileId === fileToBeRemoved.id) {
      currentFileId = replFiles[0].id
    }

    replFiles = replFiles.filter(file => file.id !== fileToBeRemoved.id)
  }

  // function dragStart () {}
  // function dragOver () {}
  // function dragLeave () {}
  // function dragEnd () {}
</script>

<style>
	.component-selector {
		position: relative;
		border-bottom: 1px solid #eee;
		overflow: hidden;
	}

	.file-tabs {
		border: none;
		margin: 0;
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: hidden
	}
</style>

<div class="component-selector">
	<div class="file-tabs" on:dblclick="{addNew}">
			
    {#each replFiles as replFile}

			<!-- <Tab
        bind:replFile
        {usedFileNames}
        active={replFile.id === currentFileId}
        on:click={click}
        on:dragstart={dragStart}
        on:dragover={dragOver}
        on:dragleave={dragLeave}
        on:dragend={dragEnd}
      /> -->
      <Tab
        bind:replFile
        {usedFileNames}
        active={replFile.id === currentFileId}
        on:select={select}
        on:remove={remove}
      /><!--

		-->{/each}<!--

		--><AddNewButton on:click={addNew} />
		
  </div>
</div>

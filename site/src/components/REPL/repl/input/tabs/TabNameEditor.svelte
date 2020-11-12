<script>
  import { createEventDispatcher } from 'svelte'
  import getFileName from '../../../utils/getFileName.js'
  import EditIcon from './EditIcon.svelte'
  import DeleteIcon from './DeleteIcon.svelte'

  export let replFile
  export let usedFileNames
  export let iconsVisible

  const dispatch = createEventDispatcher()

  let editing = false
  let fileNameBeingEdited = null

  const fileNameFormat = /(.+)\.(svelte|js|json|md)$/

  function validFileName (fileName) {
    return (
      fileNameFormat.test(fileName) &&
      (
        !usedFileNames.has(fileName) ||
        getFileName(replFile) === fileName
      )
    )
  }

  function startEditing () {
    editing = true
    fileNameBeingEdited = getFileName(replFile)
  }

  function stopEditing () {
     if (validFileName(fileNameBeingEdited)) {
      const split = fileNameBeingEdited.split('.')
      replFile.type = split.pop()
      replFile.name = split.length === 1 ? split[0] : split.join('.')

      editing = false
      fileNameBeingEdited = null
    }
  }

  function selectInput (e) {
		setTimeout(() => {
			e.target.select()
		})
  }
</script>

<style>
  input {
		position: absolute;
    left: 20px;
    top: -1px;
    width: 100%;
		border: none;
    outline: none;
    font-family: "Courier New";
    font-size: 14px;
    color: #969696;
	}

	.duplicate {
		color: var(--prime);
	}
</style>

{#if editing}

  <span style="padding: 0px 4px;">
    <EditIcon
      visible={false}
      on:click={startEditing}
    /><!--

    --><span style="padding: 0px 4px; color: white;">{fileNameBeingEdited}</span><!--

    --><DeleteIcon
      visible={false}
    />
  </span>

	<!-- svelte-ignore a11y-autofocus -->
	<input
		autofocus
		spellcheck={false}
		bind:value={fileNameBeingEdited}
		on:focus={selectInput}
		on:blur={stopEditing}
		on:keydown={e => e.which === 13 && validFileName(fileNameBeingEdited) && e.target.blur()}
		class:duplicate={usedFileNames.has(editing)}
	>

{:else}

  <span style="padding: 0px 4px;">
    <EditIcon
      visible={iconsVisible}
      on:click={startEditing}
    /><!--

    --><span style="padding: 0px 4px;">{replFile.name}.{replFile.type}</span><!--

    --><DeleteIcon
      visible={iconsVisible}
      on:click={() => dispatch('remove')}
    />
  </span>

{/if}

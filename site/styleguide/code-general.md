## JS style

- Single quotes
- No semicolons
- Imports: first external libraries, then 'svelte' libraries, then `florence`, then `florence-datacontainer`, then local files:

```js
import { scaleLinear } from 'd3-scale'
import { tick } from 'svelte'
import { Graphic } from '@snlab/florence'
import DataContainer from '@snlab/florence-datacontainer'
import { thing } from './utils.js'
```

- Seperate long assignments or expressions by newlines for readability:

```js
const scaleX = scaleLinear()
  .domain(domain)
  .nice()
// newline
const scaleY ...
```

## Svelte style

- Passing strings to props should be done like:

```js
<Component prop={'string'}>
```

- Separate components and template logic blocks by an enter for readability:

```js
{#if data}

  <Graphic width={500} height={500}>

    <!-- ... -->

  </Graphic>

{/if}
```

- If possible, always prefer `Layer`s over `Mark`s rendered with an `{#each}` block.

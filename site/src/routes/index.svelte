<style>
.leader {
  @apply text-lg sm:text-xl italic mt-4 mb-4 text-gray-900 text-center;
}
</style>

<svelte:head>
	<title>Florence: A grammar of graphics, built on Svelte's template syntax.</title>
</svelte:head>

<div>
  <div class="leader">
      Florence is a data visualization framework,
      based on the grammar of graphics,
      built on top of Svelte's template syntax.
  </div>

  <div class="intro">
    <p>
      Florence is built with existing open web standards (HTML, CSS, JavaScript) and the JavaScript framework <a target="_blank" rel="noopener" href='https://svelte.dev'>Svelte</a>.
      These are already in intensive use for online map making today, so Florence provides a convenient framework on top that is based on cartographic and visualization theory. 
    </p>
    <p>
      We adopt concepts from Bertin’s <span class="italic">Semiology of Graphics</span> and Wilkinson’s <span class="italic">
      Grammar of Graphics</span> to create a ‘language’ with a limited number of core concepts or ‘verbs’ that are combined
      with a declarative style of ‘writing’ visualizations.
    </p>
    <p>
      For a sense of the range of visualizations made possible 
      using the library, check out the interactive <a href="/examples">example gallery</a> 
      or start with the <a href="/tutorials">tutorials</a> and <a href="/docs">documentation</a>.
    </p>
    <p>
      If you want to dive straight in, try out the <a href="/repl">interactive REPL</a>.
    </p>
    <p>
      For a more detailed discussion of the framework and its design goals, please have a
      look at corresponding in article in <span class="italic">Cartographic Perspectives</span>:
    </p>
    <p>
      Poorthuis, A., van der Zee, L., Guo, G., Keong, J. H., & Dy, B. (2020).
      Florence: a Web-based Grammar of Graphics for Making Maps and Learning Cartography.
      <span class="italic">Cartographic Perspectives</span>, (96). <a href="https://doi.org/10.14714/CP96.1645">https://doi.org/10.14714/CP96.1645</a>.
    </p>
  </div>
</div>
<style>
.leader {
  @apply text-xl italic mt-4 mb-4 text-gray-900 text-center;
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
      Florence is built on top of existing open web standards that are already in intensive use for online map making today,
       but provides a framework that is firmly based on cartographic and visualization theory. 
    </p>
    <p>
      We adopt concepts from Bertin’s <span class="italic">Semiology of Graphics</span> and Wilkinson’s <span class="italic">
      Grammar of Graphics</span> to create a ‘language’ with a limited number of core concepts or verbs that are combined
      with a declarative style of ‘writing’ visualizations.
    </p>
    <p>
      For a sense of the range of visualizations made possible 
      using the library, check out the interactive <a href="/examples">example gallery</a> 
      or visit the <a href="/tutorials">tutorials</a> and <a href="/docs">documentation</a>.
    </p>
    <p>
      If you want to dive straight in, try out the <a href="/repl">interactive REPL</a>.
    </p>
  </div>
</div>
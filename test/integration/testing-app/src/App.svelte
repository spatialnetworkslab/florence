<script>
  import { Router, Route, Link } from 'svero'

  // import all playground examples here
  import Rectangles from './pages/Rectangles.svelte'


  // and add them to this component array
  let components = [
    { name: "Rectangles",
      url: "/rectangles",
      component: Rectangles
    }
  ]
</script>

<div class="flex-grid">
  <div class="left-col">
   <ul class="toc">
    {#each components as component}
      <li><Link href={component.url}>{component.name}</Link></li>  
    {/each}
   </ul>
  </div>
  <div class="right-col">
    <Router>
      <Route path="/" component={components[0].component} />
       {#each components as component}
          <Route path={component.url} component={component.component} />
        {/each}
    </Router>
  </div>
</div>

<style>
.flex-grid {
  display: flex;
}

.left-col {
  margin-right: 20px;
}

.toc {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>


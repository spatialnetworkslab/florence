<script>
  import { Router, Link, Route } from 'svelte-routing'

  
  // import all playground examples here
  import Barchart from './examples/Barchart.svelte'
  import Tradeoff from './examples/Tradeoff.svelte'
  import ComponentBasics from './examples/ComponentBasics.svelte'
  import Dashboard from './examples/Dashboard.svelte'
  import SelectBrush from './examples/SelectBrush.svelte'
  import LayerTransition from './examples/LayerTransition.svelte'

  // and add them to this component array
  let components = [
    {
      name: 'Bar chart',
      url: 'bar-chart',
      component: Barchart
    },
    {
      name: 'Trade-off',
      url: 'trade-off',
      component: Tradeoff
    },
    {
      name: 'Component basics',
      url: 'component-basics',
      component: ComponentBasics
    },
    {
      name: 'Dashboard',
      url: 'dashboard',
      component: Dashboard
    },
    {
      name: 'Select / brush',
      url: 'select-brush',
      component: SelectBrush
    },
    {
      name: 'Layer transition',
      url: 'layer-transition',
      component: LayerTransition
    }
  ]
</script>
<Router url="">
  <div class="flex-grid">
    
    <div class="left-col">
    
      <ul class="toc">
      
        {#each components as component}
          <li><Link to={component.url}>{component.name}</Link></li>  
        {/each}

      </ul>

    </div>

    <div class="right-col">
        
      <Route path="/" component={components[0].component} />
        
      {#each components as component}
        <Route path={component.url} component={component.component} />
      {/each}
      
    </div>

  </div>
</Router>

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


<script>
  import { Router, Link, Route } from 'svelte-routing'

  
  // import all playground examples here
  import Barchart from './examples/Barchart.svelte'
  import ZoomableScatterplot from './examples/ZoomableScatterplot.svelte'
  import MeetupExample from './examples/MeetupExample.svelte'

  // and add them to this component array
  let components = [
    {
      name: 'Bar chart',
      url: 'barchart',
      component: Barchart
    },
    {
      name: 'Zoomable scatterplot',
      url: 'zoomablescatterplot',
      component: ZoomableScatterplot
    },
    {
      name: 'Meetup example',
      url: 'meetup',
      component: MeetupExample
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


<script>
  import { Router, Link, Route } from 'svelte-routing'

  // import all playground examples here
  import Rectangles from './pages/Rectangles.svelte'
  import Geo from './pages/Geo.svelte'
  import LabelMark from './pages/LabelMark.svelte'
  import Line from './pages/Line.svelte'
  import Axes from './pages/Axes.svelte'
  import ScaleBandAxes from './pages/ScaleBandAxes.svelte'
  import Area from './pages/Area.svelte'
  import AreaLayer from './pages/AreaLayer.svelte'
  import NestedSections from './pages/NestedSections.svelte'
  import GridLines from './pages/GridLines.svelte'

  // and add them to this component array
  const components = [
    {
      name: 'Rectangles',
      url: '/rectangles',
      component: Rectangles
    },
    {
      name: 'Geo',
      url: '/geo',
      component: Geo
    },
    {
      name: 'Label',
      url: '/label',
      component: LabelMark
    },
    {
      name: 'Line',
      url: '/line',
      component: Line
    },
    {
      name: 'Axes',
      url: '/axes',
      component: Axes
    },
    {
      name: 'ScaleBand Axes',
      url: '/scale-band-axes',
      component: ScaleBandAxes
    },
    {
      name: 'Area',
      url: '/area',
      component: Area
    },
    {
      name: 'AreaLayer',
      url: '/arealayer',
      component: AreaLayer
    },
    {
      name: 'NestedSections',
      url: '/nestedsections',
      component: NestedSections
    },
    {
      name: 'GridLines',
      url: '/gridlines',
      component: GridLines
    }
  ]
</script>

<Router>
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


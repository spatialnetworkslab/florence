<script>
  import MapWithFlorence from './MapWithFlorence.svelte'

  import { Graphic, Point, fitScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  import { projectMapboxMercator, projectBbox } from './utils.js'
  
  // map related init constants
  const width = 400
  const height = 250
  const center = [103.8198, 1.3521]
  const zoom = 10

  // geo scale related vars
  let myGeoScale
  let myGeoScaleInit
  let originalBbox
  let scaleX
  let scaleY
  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 } // init zoom identity for 'zoom' version

  // load data
  const points = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { Name: 'Point A' }, geometry: { type: 'Point', coordinates: [103.8721611, 1.3038701] } },
      { type: 'Feature', properties: { Name: 'Point B'}, geometry: { type: 'Point', coordinates: [103.8436414, 1.2940554] } },
      { type: 'Feature', properties: { Name: 'Point C'}, geometry: { type: 'Point', coordinates: [103.8271663, 1.3059254] } },
    ]
  }

  const pointContainer = new DataContainer(points)

  // mapbox gl takes in coordinates as unprojected WGS84 (EPSG 4326) but projects to (a modified)
  // version of Web Mercator (EPSG 3857)
  // we project our WGS84 data to the same projection
  // so we can 'match' that projection in our Florence overlay
  const pointContainerProjected = pointContainer.reproject(projectMapboxMercator)

  
  // functions to create scales and update bounds for 'naive' implementation
  function setScalesNaive (event) {
    const mapInstance = event.detail
    const bbox = projectBbox(mapInstance.getBounds())
    myGeoScale = fitScales(bbox)
  }


  function updateBounds (event) {
    const bbox = projectBbox(event.detail)
    myGeoScale = fitScales(bbox)
  }


  // functions to create scales and update bounds for 'zoom' implementation
  function setScalesZoom (event) {
    const mapInstance = event.detail
    const bbox = projectBbox(mapInstance.getBounds())
    myGeoScaleInit = fitScales(bbox)
    originalBbox = bbox
    scaleX = myGeoScaleInit.scaleX.range([0, width])
    scaleY = myGeoScaleInit.scaleY.range([0, height])
  }

  function updateZoom (event) {
    calculateZoomIdentity(originalBbox, projectBbox(event.detail), zoomIdentity)
  }  

  function calculateZoomIdentity(original, current) {
    const deltaX = scaleX(original.x[0]) - scaleX(current.x[0])
    const deltaY = scaleY(original.y[0]) - scaleY(current.y[0])
    const zoom = (original.x[1] - original.x[0]) / (current.x[1] - current.x[0])
    const zoomId = { x: deltaX * zoom, y: deltaY * zoom, kx: zoom, ky: zoom }
    zoomIdentity = zoomId
  }

</script>

<!-- mapbox + florence svg + naive sync -->
<div class='container' style="position: relative;">
  <div class='map'>
    <MapWithFlorence on:load={setScalesNaive} on:pan={updateBounds} on:zoom={updateBounds} {center} {zoom} {width} {height}>
    </MapWithFlorence>
  </div>
  <div class='overlay' style="position: absolute; top: 0; left: 0; pointer-events: none;">
    <Graphic {width} {height} {...myGeoScale}>
      {#each pointContainerProjected.rows() as point}
        <Point onMouseover={(event) => console.log(event)} geometry={point['$geometry']} />
      {/each}
    </Graphic>
  </div>
</div>

<!-- mapbox + florence svg + zoom sync -->
<div class='container' style="position: relative;">
  <div class='map'>
    <MapWithFlorence on:load={setScalesZoom} on:pan={updateZoom} on:zoom={updateZoom} {center} {zoom} {width} {height}>
    </MapWithFlorence>
  </div>
  <div class='overlay' style="position: absolute; top: 0; left: 0; pointer-events: none;">
    <Graphic {width} {height} {...myGeoScaleInit} {zoomIdentity}>
      {#each pointContainerProjected.rows() as point}
        <Point onMouseover={(event) => console.log(event)} geometry={point['$geometry']} />
      {/each}
    </Graphic>
  </div>
</div>

const SNLAB_URL = 'https://cdn.jsdelivr.net/gh/spatialnetworkslab'

export default {
  name: '@snlab/florence',
  url: `${SNLAB_URL}/florence@a90efb58df17a7763dff14d3d2614c05912f6f9e/dist/index.mjs`,
  getCodeBody (code) { return code.substring(0, code.length - 446) },
  defaultExport: false,
  exportsObject: {
    Area: 'sd',
    AreaLayer: 'Hd',
    DiscreteLegend: 'Ph',
    FuncLine: 'od',
    Graphic: 'Oc',
    Grid: 'ol',
    Label: 'Zu',
    LabelLayer: 'Rd',
    Layer: 'wd',
    Line: 'Hu',
    LineLayer: 'Ld',
    Mark: 'Su',
    Point: 'Lu',
    PointLayer: 'Sd',
    Polygon: 'Xu',
    PolygonLayer: 'Nd',
    Rectangle: 'Rd',
    RectangleLayer: 'Pd',
    Section: 'Gc',
    SymbolLayer: 'Xd',
    Symbol_: 'Ku',
    Title: 'Nu',
    XAxis: 'ih',
    YAxis: 'uh',
    createGeoScales: 'dh',
    createPanHandler: 'hh',
    createZoomHandler: 'yh'
  }
}

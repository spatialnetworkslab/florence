export { default as Graphic } from './components/Core/Graphic/Graphic.svelte'
export { default as Section } from './components/Core/Section/Section.svelte'
// export { default as Grid } from './components/Core/Grid/Grid.svelte'

export { default as Area } from './components/Marks/Area/Area.svelte'
export { default as FuncLine } from './components/Marks/FuncLine/FuncLine.svelte'
export { default as Label } from './components/Marks/Label/Label.svelte'
export { default as Line } from './components/Marks/Line/Line.svelte'
export { default as Point } from './components/Marks/Point/Point.svelte'
export { default as Polygon } from './components/Marks/Polygon/Polygon.svelte'
export { default as Rectangle } from './components/Marks/Rectangle/Rectangle.svelte'
export { default as Symbol_ } from './components/Marks/Symbol/Symbol.svelte'

export { default as PointLayer } from './components/Marks/Point/PointLayer.svelte'
// export { default as RectangleLayer } from './components/Marks/Rectangle/RectangleLayer.svelte'
// export { default as PolygonLayer } from './components/Marks/Polygon/PolygonLayer.svelte'
// export { default as LineLayer } from './components/Marks/Line/LineLayer.svelte'
// export { default as LabelLayer } from './components/Marks/Label/LabelLayer.svelte'
// export { default as SymbolLayer } from './components/Marks/Symbol/SymbolLayer.svelte'
// export { default as AreaLayer } from './components/Marks/Area/AreaLayer.svelte'

// export { default as XAxis } from './components/Guides/Axes/XAxis.svelte'
// export { default as YAxis } from './components/Guides/Axes/YAxis.svelte'

// export { default as XGridLines } from './components/Guides/GridLines/XGridLines.svelte'
// export { default as YGridLines } from './components/Guides/GridLines/YGridLines.svelte'

// export { default as DiscreteLegend } from './components/Guides/Legends/DiscreteLegend.svelte'
// export { default as GradientLegend } from './components/Guides/Legends/GradientLegend.svelte'

export { default as createPanHandler } from './helpers/createPanHandler.js'
export { default as createZoomHandler } from './helpers/createZoomHandler.js'
export * from './helpers/labels.js'

export {
  fitScales,
  x2,
  y2,
  x2s,
  y2s
} from '@snlab/rendervous'

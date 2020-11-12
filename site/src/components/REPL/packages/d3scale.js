export default {
  name: 'd3-scale',
  url: 'https://cdn.jsdelivr.net/npm/d3-scale@3.2.3',
  getCodeBody (code) {
    return 'const n = {};' + code.substring(476, code.length - 53)
  },
  defaultExport: false,
  exportsObject: {
    scaleLinear: 'n.scaleLinear',
    scaleBand: 'n.scaleBand',
    scaleDivergingLog: 'n.scaleDivergingLog',
    scaleDivergingPow: 'n.scaleDivergingPow',
    scaleDivergingSymlog: 'n.scaleDivergingSymlog',
    scaleIdentity: 'n.scaleIdentity',
    scaleImplicit: 'n.scaleImplicit',
    scaleLog: 'n.scaleLog',
    scaleOrdinal: 'n.scaleOrdinal',
    scalePow: 'n.scalePow',
    scaleQuantize: 'n.scaleQuantize',
    scaleRadial: 'n.scaleRadial',
    scaleSequential: 'n.scaleSequential',
    scaleSequentialLog: 'n.scaleSequentialLog',
    scaleSequentialPow: 'n.scaleSequentialPow',
    scaleSequentialSqrt: 'n.scaleSequentialSqrt',
    scaleSequentialSymlog: 'n.scaleSequentialSymlog',
    scaleSqrt: 'n.scaleSqrt',
    scaleSymlog: 'n.scaleSymlog',
    scaleThreshold: 'n.scaleThreshold',
    scaleTime: 'n.scaleTime',
    scaleUtc: 'n.scaleUtc',
    tickFormat: 'n.tickFormat'
  }
}

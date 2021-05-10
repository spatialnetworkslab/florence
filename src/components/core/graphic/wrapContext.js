const testFuncs = [
  'setLineDash',
  'getLineDash',
  'setTransform',
  'getTransform',
  'getImageData',
  'save',
  'restore',
  'createPattern',
  'createRadialGradient',
  'addHitRegion',
  'arc',
  'arcTo',
  'beginPath',
  'clip',
  'closePath',
  'scale',
  'stroke',
  'clearHitRegions',
  'clearRect',
  'fillRect',
  'strokeRect',
  'rect',
  'resetTransform',
  'translate',
  'moveTo',
  'lineTo',
  'bezierCurveTo',
  'createLinearGradient',
  'ellipse',
  'measureText',
  'rotate',
  'drawImage',
  'drawFocusIfNeeded',
  'isPointInPath',
  'isPointInStroke',
  'putImageData',
  'strokeText',
  'fillText',
  'quadraticCurveTo',
  'removeHitRegion',
  'fill',
  'transform',
  'scrollPathIntoView',
  'createImageData'
]

export default function wrapContext (ctx) {
  const interf = {}

  testFuncs.forEach(fnName => {
    interf[fnName] = function () {
      console.log(fnName)
      ctx[fnName](...arguments)
    }
  })

  const proxy = new Proxy(interf, {
    set (obj, prop, value) {
      console.log(`SET: ${prop}`)
      ctx[prop] = value

      return true
    }
  })

  return proxy
}

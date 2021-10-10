Object.defineProperty(global.SVGSVGElement.prototype, 'createSVGMatrix', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    martix: jest.fn(() => [[]]),
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    flipX: jest.fn().mockImplementation(() => global.SVGSVGElement),
    flipY: jest.fn().mockImplementation(() => global.SVGSVGElement),
    inverse: jest.fn().mockImplementation(() => global.SVGSVGElement),
    multiply: jest.fn().mockImplementation(() => global.SVGSVGElement),
    rotate: jest.fn().mockImplementation(() => ({
      translate: jest.fn().mockImplementation(() => ({
        rotate: jest.fn()
      }))
    })),
    rotateFromVector: jest.fn().mockImplementation(() => global.SVGSVGElement),
    scale: jest.fn().mockImplementation(() => global.SVGSVGElement),
    scaleNonUniform: jest.fn().mockImplementation(() => global.SVGSVGElement),
    skewX: jest.fn().mockImplementation(() => global.SVGSVGElement),
    skewY: jest.fn().mockImplementation(() => global.SVGSVGElement),
    translate: jest.fn().mockImplementation(() => ({
      multiply: jest.fn().mockImplementation(() => ({
        multiply: jest.fn().mockImplementation(() => global.SVGSVGElement)
      }))
    }))
  }))
})

Object.defineProperty(global.SVGSVGElement.prototype, 'createSVGPoint', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    x: 0,
    y: 0,
    matrixTransform: jest.fn().mockImplementation(() => ({
      x: 0,
      y: 0
    }))
  }))
})

Object.defineProperty(global.SVGSVGElement.prototype, 'createSVGTransform', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    angle: 0,
    matrix: {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0,
      multiply: jest.fn()
    },
    setMatrix: jest.fn(),
    setTranslate: jest.fn()
  }))
})

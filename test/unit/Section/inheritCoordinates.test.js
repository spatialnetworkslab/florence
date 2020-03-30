import { getPixelCoordinates } from '../../../src/components/Core/Section/getPixelCoordinates.js'
import { createSectionContext } from '../../../src/components/Core/Section/SectionContext/createSectionContext.js'

describe('Section: inherit coordinates from parent', () => {
  test('parent (x1 < x2, y1 < y2)', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 0, x2: 700, y1: 0, y2: 500 }
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 0, x2: 700, y1: 0, y2: 500 })
  })

  test('parent (x1 > x2, y1 > y2)', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 700, x2: 0, y1: 500, y2: 0 }
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 700, x2: 0, y1: 500, y2: 0 })
  })

  test('parent (x1 < x2, y1 < y2), padding', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 0, x2: 700, y1: 0, y2: 500 },
      padding: { left: 30, right: 20, top: 20, bottom: 30 }
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 30, x2: 680, y1: 20, y2: 470 })
  })

  test('parent (x1 > x2, y1 > y2), padding', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 700, x2: 0, y1: 500, y2: 0 },
      padding: { left: 30, right: 20, top: 20, bottom: 30 }
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 680, x2: 30, y1: 470, y2: 20 })
  })

  test('parent (x1 < x2, y1 < y2), padding, flipY', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 0, x2: 700, y1: 0, y2: 500 },
      padding: { left: 30, right: 20, top: 20, bottom: 30 },
      flipY: true
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 30, x2: 680, y1: 470, y2: 20 })
  })

  test('parent (x1 > x2, y1 > y2), padding, flipY', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 700, x2: 0, y1: 500, y2: 0 },
      padding: { left: 30, right: 20, top: 20, bottom: 30 },
      flipY: true
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 680, x2: 30, y1: 20, y2: 470 })
  })

  test('parent (x1 < x2, y1 < y2), padding, flipX', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 0, x2: 700, y1: 0, y2: 500 },
      padding: { left: 30, right: 20, top: 20, bottom: 30 },
      flipX: true
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 680, x2: 30, y1: 20, y2: 470 })
  })

  test('parent (x1 > x2, y1 > y2), padding, flipX', () => {
    const parentContext = createSectionContext({
      coordinates: { x1: 700, x2: 0, y1: 500, y2: 0 },
      padding: { left: 30, right: 20, top: 20, bottom: 30 },
      flipX: true
    })

    const sectionInput = { x1: undefined, x2: undefined, y1: undefined, y2: undefined }
    const sectionCoordinates = getPixelCoordinates(sectionInput, parentContext)

    expect(sectionCoordinates).toEqual({ x1: 30, x2: 680, y1: 470, y2: 20 })
  })
})

import { createSectionContext } from '../../../src/components/Core/Section/SectionContext/createSectionContext.js'

describe('Section: zoomIdentity', () => {
  test('kx must be positive', () => {
    const sectionData = {
      coordinates: { x1: 1, x2: 2, y1: 1, y2: 2 },
      zoomIdentity: { x: 0, y: 0, kx: -1, ky: 1 }
    }

    expect(() => createSectionContext(sectionData)).toThrow()
  })

  test('ky must be positive', () => {
    const sectionData = {
      coordinates: { x1: 1, x2: 2, y1: 1, y2: 2 },
      zoomIdentity: { x: 0, y: 0, kx: 1, ky: -1 }
    }

    expect(() => createSectionContext(sectionData)).toThrow()
  })
})

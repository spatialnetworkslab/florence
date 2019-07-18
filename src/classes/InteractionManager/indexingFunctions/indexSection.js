export function indexSection (sectionData) {
  const sectionGeometry = { rangeX: sectionData.rangeX, rangeY: sectionData.rangeY }

  const item = calculateBBox(sectionGeometry)

  item.geometry = sectionGeometry
  item.elementType = 'Section'
  item.sectionId = sectionData.sectionId

  return item
}

function calculateBBox (sectionGeometry) {
  return {
    x1: sectionGeometry.rangeX[0],
    x2: sectionGeometry.rangeX[1],
    y1: sectionGeometry.rangeY[0],
    y2: sectionGeometry.rangeY[1]
  }
}

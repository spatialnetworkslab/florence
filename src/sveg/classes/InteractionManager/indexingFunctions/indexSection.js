export function indexSection (sectionData) {
  let sectionGeometry = {'rangeX': sectionData.rangeX, 'rangeY': sectionData.rangeY}

  let item = calculateBBox(sectionGeometry)

  item.geometry = sectionGeometry
  item.elementType = 'Section'
  item.sectionId = sectionData.sectionId

  return item
}

function calculateBBox (sectionGeometry) {
  return {
    minX: sectionGeometry.rangeX[0],
    maxX: sectionGeometry.rangeX[1],
    minY: sectionGeometry.rangeY[0],
    maxY: sectionGeometry.rangeY[1]
  }
}


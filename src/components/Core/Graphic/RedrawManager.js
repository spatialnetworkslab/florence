export default class RedrawManager {
  constructor () {
    this.sections = {}
  }

  addRootSection (section) {
    this.sections[section.id] = {
      data: section,
      childSections: []
    }
  }

  addSection (section, parentSection) {
    this.sections[section.id] = {
      data: section,
      parentSection: parentSection.id,
      childSections: []
    }

    this.sections[parentSection.id].childSections.push(section.id)
  }

  removeSection (section) {
    const parentId = this.sections[section.id].parentSection
    delete this.sections[section.id]
    this.sections[parentId].childSections.delete(parentId) // TODO
  }

  addMark (mark, section) {

  }

  removeMark (mark) {

  }

  addLayer (layer, section) {

  }

  removeLayer (layer) {

  }

  triggerUpdate (section) {

  }
}

// https://stackoverflow.com/a/32088787/7237112
// function sectionsOverlap (section1, section2) {
//   const bbox1 = section1.bbox
//   const bbox2 = section2.bbox

//   return (
//     bbox1.minX < bbox2.maxX &&
//     bbox1.maxX > bbox2.minX &&
//     bbox1.minY < bbox2.maxY &&
//     bbox1.maxY > bbox2.minY
//   )
// }

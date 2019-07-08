import TransformableDataContainer from './TransformableDataContainer'

function proxyTransformationCall (data, transformation, options) {
  let transformableDataContainer = new TransformableDataContainer(data)
  transformableDataContainer = transformableDataContainer[transformation](options)
  return transformableDataContainer
}

const methods = {
  arrange (sortInstructions) {
    return proxyTransformationCall(this._data, 'arrange', sortInstructions)
  },

  bin (binInstructions) {
    return proxyTransformationCall(this._data, 'bin', binInstructions)
  },

  dropNA (dropInstructions) {
    return proxyTransformationCall(this._data, 'dropNA', dropInstructions)
  },

  filter (filterFunction) {
    return proxyTransformationCall(this._data, 'filter', filterFunction)
  },

  groupBy (groupByInstructions) {
    return proxyTransformationCall(this._data, 'groupBy', groupByInstructions)
  },

  mutarise (mutariseInstructions) {
    return proxyTransformationCall(this._data, 'mutarise', mutariseInstructions)
  },

  mutarize (mutariseInstructions) {
    return proxyTransformationCall(this._data, 'mutarize', mutariseInstructions)
  },

  mutate (mutateInstructions) {
    return proxyTransformationCall(this._data, 'mutate', mutateInstructions)
  },

  transmute (transmuteInstructions) {
    return proxyTransformationCall(this._data, 'transmute', transmuteInstructions)
  },

  rename (renameInstructions) {
    return proxyTransformationCall(this._data, 'rename', renameInstructions)
  },

  reproject (reprojectInstructions) {
    return proxyTransformationCall(this._data, 'reproject', reprojectInstructions)
  },

  select (selection) {
    return proxyTransformationCall(this._data, 'select', selection)
  },

  summarise (summariseInstructions) {
    return proxyTransformationCall(this._data, 'summarise', summariseInstructions)
  },

  summarize (summariseInstructions) {
    return proxyTransformationCall(this._data, 'summarize', summariseInstructions)
  },

  transform (transformFunction) {
    return proxyTransformationCall(this._data, 'transform', transformFunction)
  }
}

export default function (targetClass) {
  Object.assign(targetClass.prototype, methods)
}

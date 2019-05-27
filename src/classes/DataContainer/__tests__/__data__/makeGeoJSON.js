export function valid () {
  let obj = {}
  obj = addType(obj)
  obj['features'] = dummyFeatures

  return obj
}

export function missingType () {
  let obj = {}
  obj['features'] = dummyFeatures

  return obj
}

export function missingFeatures () {
  let obj = {}
  obj = addType(obj)

  return obj
}

export function emptyFeatures () {
  let obj = {}
  obj = addType(obj)
  obj['features'] = []

  return obj
}

export function notSameProperties () {
  let obj = {}
  obj = addType(obj)
  obj['features'] = [...dummyFeatures, featureWithDifferentProperty]

  return obj
}

export function validGeometries () {
  return dummyFeatures.map(feature => feature.geometry)
}

export function propertiesWith$ () {
  return dummyFeatures.map(feature => ({
    type: feature.type,
    geometry: feature.geometry,
    properties: { $column: 'value' }
  }))
}

export function propertiesWithSlash () {
  return dummyFeatures.map(feature => ({
    type: feature.type,
    geometry: feature.geometry,
    properties: { 'col/umn': 'value' }
  }))
}

function addType (obj) {
  obj['type'] = 'FeatureCollection'
  return obj
}

const dummyFeatures = [
  {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [102.0, 0.5]
    },
    'properties': {
      'prop0': 'value0'
    }
  },

  {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [52.0, 30.5]
    },
    'properties': {
      'prop0': 'value1'
    }
  }
]

const featureWithDifferentProperty = {
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [32.0, 100.5]
  },
  'properties': {
    'prop1': 'value2'
  }
}

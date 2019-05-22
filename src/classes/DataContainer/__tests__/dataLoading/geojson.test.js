import DataContainer from '../../index.js'
import {
  valid, missingType, missingFeatures, emptyFeatures, notSameProperties, validGeometries
} from './__data__/makeGeoJSON.js/'

describe('loading geojson data', () => {
  test('allowed geojson throws no error', () => {
    expect(() => new DataContainer(valid())).not.toThrow()
  })

  test('geojson lacking type of FeatureCollection throws error', () => {
    expect(() => new DataContainer(missingType())).toThrow()
  })

  test('geojson lacking features Array throws error', () => {
    expect(() => new DataContainer(missingFeatures())).toThrow()
  })

  test('geojson features cannot be empty', () => {
    expect(() => new DataContainer(emptyFeatures())).toThrow()
  })

  test('every feature must have same properties', () => {
    expect(() => new DataContainer(notSameProperties())).toThrow()
  })

  test('geojson geometry ends up in $geometry column', () => {
    const validGeoData = valid()
    const dataContainer = new DataContainer(validGeoData)
    const expectedGeometries = validGeometries()

    expect(dataContainer.hasColumn('$geometry')).toBe(true)
    expect(dataContainer.column('$geometry')).toEqual(expectedGeometries)
  })
})

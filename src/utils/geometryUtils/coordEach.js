// This function comes from Turf's wonderful geospatial lib
// We only need this single function and importing it from @turf/meta
// doesn't work well for in-browser compilation
// https://github.com/Turfjs/turf

// The MIT License (MIT)

// Copyright (c) 2019 Morgan Herlocker

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export default function coordEach (geojson, callback, excludeWrapCoord) {
  // Handles null Geometry -- Skips this GeoJSON
  if (geojson === null) return
  var j; var k; var l; var geometry; var stopG; var coords
  var geometryMaybeCollection
  var wrapShrink = 0
  var coordIndex = 0
  var isGeometryCollection
  var type = geojson.type
  var isFeatureCollection = type === 'FeatureCollection'
  var isFeature = type === 'Feature'
  var stop = isFeatureCollection ? geojson.features.length : 1

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry
      : (isFeature ? geojson.geometry : geojson))
    isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1

    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0
      var geometryIndex = 0
      geometry = isGeometryCollection
        ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection

      // Handles null Geometry -- Skips this geometry
      if (geometry === null) continue
      coords = geometry.coordinates
      var geomType = geometry.type

      wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0

      switch (geomType) {
        case null:
          break
        case 'Point':
          if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false
          coordIndex++
          multiFeatureIndex++
          break
        case 'LineString':
        case 'MultiPoint':
          for (j = 0; j < coords.length; j++) {
            if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false
            coordIndex++
            if (geomType === 'MultiPoint') multiFeatureIndex++
          }
          if (geomType === 'LineString') multiFeatureIndex++
          break
        case 'Polygon':
        case 'MultiLineString':
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false
              coordIndex++
            }
            if (geomType === 'MultiLineString') multiFeatureIndex++
            if (geomType === 'Polygon') geometryIndex++
          }
          if (geomType === 'Polygon') multiFeatureIndex++
          break
        case 'MultiPolygon':
          for (j = 0; j < coords.length; j++) {
            geometryIndex = 0
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false
                coordIndex++
              }
              geometryIndex++
            }
            multiFeatureIndex++
          }
          break
        case 'GeometryCollection':
          for (j = 0; j < geometry.geometries.length; j++) { if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false }
          break
        default:
          throw new Error('Unknown Geometry Type')
      }
    }
  }
}

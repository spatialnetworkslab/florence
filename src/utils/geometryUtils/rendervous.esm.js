const invalidInputError = new Error('Invalid input');

function getInput (geometry) {
  if ('coordinates' in geometry) {
    return 'geojson'
  }

  if ('x' in geometry && 'y' in geometry) {
    if (geometry.type !== 'Point') {
      ensureSameLength(geometry.x, geometry.y);
    }

    return 'xy'
  }

  throw invalidInputError
}

function ensureSameLength (x, y) {
  if (x !== undefined && y !== undefined) {
    if (x.constructor === Array && y.constructor === Array) {
      if (x.length === y.length && x.length > 1) {
        return
      }
    }
  }

  throw invalidInputError
}

function roundPoint ([x, y], decimals) {
  const zeroes = 10 ** decimals;

  return [
    Math.round(x * zeroes) / zeroes,
    Math.round(y * zeroes) / zeroes
  ]
}

function pointDistance (p1, p2) {
  return Math.sqrt(
    (p1[0] - p2[0]) ** 2 +
    (p1[1] - p2[1]) ** 2
  )
}

function transformLinearRing (linearRing, transformation, settings) {
  if (!settings.simplify || linearRing.length < 3) {
    return transformLinearRingUnsimplified(linearRing, transformation)
  }

  if (settings.simplify === true) {
    return transformLinearRingSimplified(linearRing, transformation, settings.simplificationTreshold)
  }
}

function transformLinearRingUnsimplified (linearRing, transformation) {
  const transformedLinearRing = [];

  for (let i = 0; i < linearRing.length; i++) {
    transformedLinearRing.push(transformation(linearRing[i]));
  }

  return transformedLinearRing
}

function transformLinearRingSimplified (linearRing, transformation, simplificationTreshold = 1) {
  const transformedLinearRing = [transformation(linearRing[0])];

  let start = transformedLinearRing[0];
  let end;

  for (let i = 1; i < linearRing.length - 1; i++) {
    end = transformation(linearRing[i]);

    const dontSkip = pointDistance(start, end) >= simplificationTreshold;

    if (dontSkip) {
      transformedLinearRing.push(end);
      start = end;
    }
  }

  const lastPoint = transformation(linearRing[linearRing.length - 1]);
  transformedLinearRing.push(lastPoint);

  return transformedLinearRing
}

function transformSetOfLinearRings (linearRings, transformation, settings) {
  const transformedLinearRings = [];

  for (let i = 0; i < linearRings.length; i++) {
    transformedLinearRings.push(transformLinearRing(linearRings[i], transformation, settings));
  }

  return transformedLinearRings
}

function transformXYArrays ({ x, y }, transformation, settings) {
  if (!settings.simplify || x.length < 3) {
    return transformXYArraysUnsimplified(x, y, transformation)
  }

  if (settings.simplify === true) {
    return transformXYArraysSimplified(x, y, transformation, settings.simplificationTreshold)
  }
}

function transformXYArraysUnsimplified (x, y, transformation) {
  const transformedLinearRing = [];

  for (let i = 0; i < x.length; i++) {
    transformedLinearRing.push(transformation([x[i], y[i]]));
  }

  return transformedLinearRing
}

function transformXYArraysSimplified (x, y, transformation, simplificationTreshold = 1) {
  const transformedLinearRing = [transformation([x[0], y[0]])];

  let start = transformedLinearRing[0];
  let end;

  for (let i = 1; i < x.length - 1; i++) {
    end = transformation([x[i], y[i]]);

    const dontSkip = pointDistance(start, end) >= simplificationTreshold;

    if (dontSkip) {
      transformedLinearRing.push(end);
      start = end;
    }
  }

  const lastIndex = x.length - 1;
  const lastPoint = transformation([x[lastIndex], y[lastIndex]]);
  transformedLinearRing.push(lastPoint);

  return transformedLinearRing
}

const transformFunctions = {
  transformPoint,
  transformMultiPoint,
  transformLineString,
  transformMultiLineString,
  transformPolygon,
  transformMultiPolygon
};

function transformGeometry (geometry, _transformation, settings = {}) {
  const functionName = 'transform' + geometry.type;

  const transformation = settings.decimals
    ? point => roundPoint(_transformation(point), settings.decimals)
    : _transformation;

  return transformFunctions[functionName](geometry, transformation, settings)
}

function transformPoint (point, transformation) {
  const input = getInput(point);

  if (input === 'geojson') {
    return {
      type: 'Point',
      coordinates: transformation(point.coordinates)
    }
  }

  if (input === 'xy') {
    return {
      type: 'Point',
      coordinates: transformation([
        point.x,
        point.y
      ])
    }
  }
}

function transformMultiPoint (multiPoint, transformation) {
  const input = getInput(multiPoint);

  if (input === 'geojson') {
    return {
      type: 'MultiPoint',
      coordinates: transformLinearRing(multiPoint.coordinates, transformation, {})
    }
  }

  if (input === 'xy') {
    return {
      type: 'MultiPoint',
      coordinates: transformXYArrays(multiPoint, transformation, {})
    }
  }
}

function transformLineString (lineString, transformation, settings) {
  const input = getInput(lineString);

  if (input === 'geojson') {
    return {
      type: 'LineString',
      coordinates: transformLinearRing(lineString.coordinates, transformation, settings)
    }
  }

  if (input === 'xy') {
    return {
      type: 'LineString',
      coordinates: transformXYArrays(lineString, transformation, settings)
    }
  }
}

function transformMultiLineString (multiLineString, transformation, settings) {
  const input = getInput(multiLineString);

  if (input === 'geojson') {
    return {
      type: 'MultiLineString',
      coordinates: transformSetOfLinearRings(multiLineString.coordinates, transformation, settings)
    }
  }

  if (input === 'xy') {
    return {
      type: 'MultiLineString',
      coordinates: [
        transformXYArrays(multiLineString, transformation, settings)
      ]
    }
  }
}

function transformPolygon (polygon, transformation, settings) {
  const input = getInput(polygon);

  if (input === 'geojson') {
    return {
      type: 'Polygon',
      coordinates: transformSetOfLinearRings(polygon.coordinates, transformation, settings)
    }
  }

  if (input === 'xy') {
    return {
      type: 'Polygon',
      coordinates: [
        transformXYArrays(polygon, transformation, settings)
      ]
    }
  }
}

function transformMultiPolygon (multiPolygon, transformation, settings) {
  const input = getInput(multiPolygon);

  if (input === 'geojson') {
    const polygons = multiPolygon.coordinates;
    const transformedPolygons = [];

    for (let i = 0; i < polygons.length; i++) {
      transformedPolygons.push(transformSetOfLinearRings(polygons[i], transformation, settings));
    }

    return {
      type: 'MultiPolygon',
      coordinates: transformedPolygons
    }
  }

  if (input === 'xy') {
    return {
      type: 'MultiPolygon',
      coordinates: [
        [transformXYArrays(multiPolygon, transformation, settings)]
      ]
    }
  }
}

function createDownScaler ({ scaleX, scaleY }) {
  const sX = scaleX.copy().range([0, 2 * Math.PI]);
  const sY = scaleY.copy().range([0, 1]);

  return ([x, y]) => [sX(x), sY(y)]
}

function getNumberOfInterpolatedPoints (
  from,
  to,
  scaleDown,
  context,
  { interpolationTreshold = 1 }
) {
  const fromScaledDown = scaleDown(from);
  const toScaledDown = scaleDown(to);
  const totalScaleFactor = getTotalScaleFactor(context);

  if (straightInYDimension(fromScaledDown, toScaledDown, totalScaleFactor)) {
    return 0
  }

  const functionalForm = getFunctionalForm(fromScaledDown, toScaledDown);
  const scaledDownLength = getPolarLength(functionalForm);

  const realLength = scaledDownLength * totalScaleFactor;
  const numberOfPointsNeeded = realLength / interpolationTreshold;

  return Math.ceil(numberOfPointsNeeded) - 1
}

function getFunctionalForm (from, to) {
  const pointsSorted = from[0] < to[0]
    ? [from, to]
    : [to, from];

  const [[x1, y1], [x2, y2]] = pointsSorted;

  const a = (y2 - y1) / (x2 - x1);
  const b = y1 - (x1 * a);
  const interval = [x1, x2];

  return { a, b, interval }
}

function straightInYDimension (from, to, totalScaleFactor) {
  return Math.abs(from[0] - to[0]) * totalScaleFactor < 1
}

function getPolarLength ({ a, b, interval }) {
  const [c, d] = interval;
  const aSq = a ** 2;
  const bSq = b ** 2;

  /*
   * This is the integral of:
   * sqrt( (a * theta + b) ** 2 + a ** 2 )
   * between c and d
   */
  return (
    aSq * Math.asinh((a * d + b) / a) + (a * d + b) *
    Math.sqrt(aSq * d ** 2 + 2 * a * b * d + bSq + aSq) -
    aSq * Math.asinh((a * c + b) / a) + (-a * c - b) *
    Math.sqrt(aSq * c ** 2 + 2 * a * b * c + bSq + aSq)
  ) / (2 * a)
}

function getTotalScaleFactor ({ rangeX, rangeY, zoomIdentity }) {
  const kx = zoomIdentity ? zoomIdentity.kx : 1;
  const ky = zoomIdentity ? zoomIdentity.ky : 1;

  const totalScaleFactorX = Math.abs(Math.abs(rangeX[1] - rangeX[0]) * kx);
  const totalScaleFactorY = Math.abs(Math.abs(rangeY[1] - rangeY[0]) * ky);

  return Math.max(totalScaleFactorX, totalScaleFactorY)
}

function interpolatePoints (
  transformedLinearRing,
  from,
  to,
  transformation,
  numberOfPointsNeeded
) {
  const interpolator = interpolate(from, to);

  for (let i = 0; i < numberOfPointsNeeded; i++) {
    const t = i / numberOfPointsNeeded;
    transformedLinearRing.push(interpolator(t));
  }
}

function interpolate (from, to) {
  const dx = from[0] - to[0];
  const dy = from[1] - to[1];

  return t => ([
    from[0] + t * dx,
    from[1] + t * dy
  ])
}

function interpolateLinearRing (linearRing, transformation, context, settings) {
  if (!settings.simplify || linearRing.length < 3) {
    return interpolateLinearRingUnsimplified(linearRing, transformation, context, settings)
  }

  if (settings.simplify === true) {
    return interpolateLinearRingSimplified()
  }
}

function interpolateLinearRingUnsimplified (linearRing, transformation, context, settings) {
  const interpolatedLinearRing = [];
  const scaleDown = createDownScaler(context);

  for (let i = 0; i < linearRing.length - 1; i++) {
    const from = linearRing[i];
    const to = linearRing[i + 1];

    interpolatedLinearRing.push(transformation(from));

    const numberOfPointsNeeded = getNumberOfInterpolatedPoints(
      from,
      to,
      scaleDown,
      context,
      settings
    );

    if (numberOfPointsNeeded > 0) {
      interpolatePoints(interpolatedLinearRing, from, to, transformation, numberOfPointsNeeded);
    }
  }

  const lastPoint = linearRing[linearRing.length - 1];
  interpolatedLinearRing.push(transformation(lastPoint));

  return interpolatedLinearRing
}

function interpolateLinearRingSimplified (linearRing, transformation, context, settings) {

}

function interpolateSetOfLinearRings (linearRings, transformation, context, settings) {
  const interpolatedLinearRings = [];

  for (let i = 0; i < linearRings.length; i++) {
    interpolatedLinearRings.push(interpolateLinearRing(linearRings[i], transformation, context, settings));
  }

  return interpolatedLinearRings
}

function interpolateXYArrays ({ x, y }, transformation, context, settings) {
  if (!settings.simplify || x.length < 3) {
    return interpolateXYArraysUnsimplified(x, y, transformation, context, settings)
  }

  if (settings.simplify === true) {
    return interpolateXYArraysSimplified()
  }
}

function interpolateXYArraysUnsimplified (x, y, transformation, context, settings) {
  const interpolatedLinearRing = [];
  const scaleDown = createDownScaler(context);

  for (let i = 0; i < x.length - 1; i++) {
    const from = [x[i], y[i]];
    const to = [x[i + 1], y[i + 1]];

    interpolatedLinearRing.push(transformation(from));

    const numberOfPointsNeeded = getNumberOfInterpolatedPoints(
      from,
      to,
      scaleDown,
      context,
      settings
    );

    if (numberOfPointsNeeded > 0) {
      interpolatePoints(interpolatedLinearRing, from, to, transformation, numberOfPointsNeeded);
    }
  }

  const lastIndex = x.length - 1;
  const lastPoint = [x[lastIndex], y[lastIndex]];
  interpolatedLinearRing.push(transformation(lastPoint));

  return interpolatedLinearRing
}

function interpolateXYArraysSimplified (x, y, transformation, context, settings) {

}

const interpolateFunctions = {
  interpolateLineString,
  interpolateMultiLineString,
  interpolatePolygon,
  interpolateMultiPolygon
};

function interpolateGeometry (geometry, _transformation, context, settings = {}) {
  const functionName = 'interpolate' + geometry.type;

  const transformation = settings.decimals
    ? point => roundPoint(_transformation(point), settings.decimals)
    : _transformation;

  return interpolateFunctions[functionName](geometry, transformation, context, settings)
}

function interpolateLineString (lineString, transformation, context, settings) {
  const input = getInput(lineString);

  if (input === 'geojson') {
    return {
      type: 'LineString',
      coordinates: interpolateLinearRing(lineString.coordinates, transformation, context, settings)
    }
  }

  if (input === 'xy') {
    return {
      type: 'LineString',
      coordinates: interpolateXYArrays(lineString, transformation, context, settings)
    }
  }
}

function interpolateMultiLineString (multiLineString, transformation, context, settings) {
  const input = getInput(multiLineString);

  if (input === 'geojson') {
    return {
      type: 'MultiLineString',
      coordinates: interpolateSetOfLinearRings(multiLineString.coordinates, transformation, context, settings)
    }
  }

  if (input === 'xy') {
    return {
      type: 'MultiLineString',
      coordinates: [
        interpolateXYArrays(multiLineString, transformation, context, settings)
      ]
    }
  }
}

function interpolatePolygon (polygon, transformation, context, settings) {
  const input = getInput(polygon);

  if (input === 'geojson') {
    return {
      type: 'Polygon',
      coordinates: interpolateSetOfLinearRings(polygon.coordinates, transformation, context, settings)
    }
  }

  if (input === 'xy') {
    return {
      type: 'Polygon',
      coordinates: [
        interpolateXYArrays(polygon, transformation, context, settings)
      ]
    }
  }
}

function interpolateMultiPolygon (multiPolygon, transformation, context, settings) {
  const input = getInput(multiPolygon);

  if (input === 'geojson') {
    const polygons = multiPolygon.coordinates;
    const transformedPolygons = [];

    for (let i = 0; i < polygons.length; i++) {
      transformedPolygons.push(interpolateSetOfLinearRings(polygons[i], transformation, context, settings));
    }

    return {
      type: 'MultiPolygon',
      coordinates: transformedPolygons
    }
  }

  if (input === 'xy') {
    return {
      type: 'MultiPolygon',
      coordinates: [
        [interpolateXYArrays(multiPolygon, transformation, context, settings)]
      ]
    }
  }
}

export { interpolateGeometry, transformGeometry };

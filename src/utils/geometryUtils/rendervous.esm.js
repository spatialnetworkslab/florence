function pointDistance (point1, point2) {
  return Math.sqrt(
    (point1[0] - point2[0]) ** 2 +
    (point1[1] - point2[1]) ** 2
  )
}

function naiveTransformLinearRing (linearRing, transformation, settings) {
  if (!settings.simplify || linearRing.length < 3) {
    return naiveTransformLinearRingUnsimplified(linearRing, transformation)
  }

  if (settings.simplify === true) {
    return naiveTransformLinearRingSimplified(linearRing, transformation, settings.simplificationTreshold)
  }
}

function naiveTransformLinearRingUnsimplified (linearRing, transformation) {
  const transformedLinearRing = [];

  for (let i = 0; i < linearRing.length; i++) {
    transformedLinearRing.push(transformation(linearRing[i]));
  }

  return transformedLinearRing
}

function naiveTransformLinearRingSimplified (linearRing, transformation, simplificationTreshold = 1) {
  const transformedLinearRing = [transformation(linearRing[0])];

  let from = transformedLinearRing[0];
  let to;

  for (let i = 1; i < linearRing.length - 1; i++) {
    to = transformation(linearRing[i]);

    const dontSkip = pointDistance(from, to) >= simplificationTreshold;

    if (dontSkip) {
      transformedLinearRing.push(to);
      from = to;
    }
  }

  const lastPoint = transformation(linearRing[linearRing.length - 1]);
  transformedLinearRing.push(lastPoint);

  return transformedLinearRing
}

function naiveTransformSetOfLinearRings (linearRings, transformation, settings) {
  const transformedLinearRings = [];

  for (let i = 0; i < linearRings.length; i++) {
    transformedLinearRings.push(naiveTransformLinearRing(linearRings[i], transformation, settings));
  }

  return transformedLinearRings
}

function naiveTransformXYArrays ({ x, y }, transformation, settings) {
  if (!settings.simplify || x.length < 3) {
    return naiveTransformXYArraysUnsimplified(x, y, transformation)
  }

  if (settings.simplify === true) {
    return naiveTransformXYArraysSimplified(x, y, transformation, settings.simplificationTreshold)
  }
}

function naiveTransformXYArraysUnsimplified (x, y, transformation) {
  const transformedLinearRing = [];

  for (let i = 0; i < x.length; i++) {
    transformedLinearRing.push(transformation([x[i], y[i]]));
  }

  return transformedLinearRing
}

function naiveTransformXYArraysSimplified (x, y, transformation, simplificationTreshold = 1) {
  const transformedLinearRing = [transformation([x[0], y[0]])];

  let from = transformedLinearRing[0];
  let to;

  for (let i = 1; i < x.length - 1; i++) {
    to = transformation([x[i], y[i]]);

    const dontSkip = pointDistance(from, to) >= simplificationTreshold;

    if (dontSkip) {
      transformedLinearRing.push(to);
      from = to;
    }
  }

  const lastIndex = x.length - 1;
  const lastPoint = transformation([x[lastIndex], y[lastIndex]]);
  transformedLinearRing.push(lastPoint);

  return transformedLinearRing
}

const invalidInputError = new Error('Invalid input');

function getInput (geometry) {
  if ('coordinates' in geometry) {
    return 'geojson'
  }

  if ('x' in geometry && 'y' in geometry) {
    ensureSameLength(geometry.x, geometry.y);

    return 'xyArrays'
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

const naiveTransformFunctions = {
  naiveTransformLineString,
  naiveTransformMultiLineString,
  naiveTransformPolygon,
  naiveTransformMultiPolygon
};

function naiveTransformGeometry (geometry, transformation, settings) {
  const functionName = 'naiveTransform' + geometry.type;
  return naiveTransformFunctions[functionName](geometry, transformation, settings)
}

function naiveTransformLineString (lineString, transformation, settings) {
  const input = getInput(lineString);

  if (input === 'geojson') {
    return {
      type: 'LineString',
      coordinates: naiveTransformLinearRing(lineString.coordinates, transformation, settings)
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'LineString',
      coordinates: naiveTransformXYArrays(lineString, transformation, settings)
    }
  }
}

function naiveTransformMultiLineString (multiLineString, transformation, settings) {
  const input = getInput(multiLineString);

  if (input === 'geojson') {
    return {
      type: 'MultiLineString',
      coordinates: naiveTransformSetOfLinearRings(multiLineString.coordinates, transformation, settings)
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'MultiLineString',
      coordinates: [
        naiveTransformXYArrays(multiLineString, transformation, settings)
      ]
    }
  }
}

function naiveTransformPolygon (polygon, transformation, settings) {
  const input = getInput(polygon);

  if (input === 'geojson') {
    return {
      type: 'Polygon',
      coordinates: naiveTransformSetOfLinearRings(polygon.coordinates, transformation, settings)
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'Polygon',
      coordinates: [
        naiveTransformXYArrays(polygon, transformation, settings)
      ]
    }
  }
}

function naiveTransformMultiPolygon (multiPolygon, transformation, settings) {
  const input = getInput(multiPolygon);

  if (input === 'geojson') {
    const polygons = multiPolygon.coordinates;
    const transformedPolygons = [];

    for (let i = 0; i < polygons.length; i++) {
      transformedPolygons.push(naiveTransformSetOfLinearRings(polygons[i], transformation, settings));
    }

    return {
      type: 'MultiPolygon',
      coordinates: transformedPolygons
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'MultiPolygon',
      coordinates: [
        [naiveTransformXYArrays(multiPolygon, transformation, settings)]
      ]
    }
  }
}

function pointIntersectsLineSegment (point, lineSegment, lineWidth) {
  const distance = distanceClosestPointOnLineSegment(point, lineSegment);

  return distance < (lineWidth / 2)
}

function distanceClosestPointOnLineSegment (point, lineSegment) {
  const closestPoint = closestPointOnLineSegment(point, lineSegment);
  return pointDistance(point, closestPoint)
}

// https://stackoverflow.com/a/6853926/7237112
function closestPointOnLineSegment (point, lineSegment) {
  // Point coordinates
  const x = point[0];
  const y = point[1];

  // Line segment coordinates
  const x1 = lineSegment[0][0];
  const y1 = lineSegment[0][1];
  const x2 = lineSegment[1][0];
  const y2 = lineSegment[1][1];

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lengthSquared = C * C + D * D;
  let param = -1;
  if (lengthSquared !== 0) { // in case of 0 length line
    param = dot / lengthSquared;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return [xx, yy]
}

function interpolatePointPair (
  from, to, transformation, interpolationTreshold = 1, interpolatedPoints
) {
  const midPoint = interpolatePoint(from, to, 0.5);

  if (interpolationBetweenPointsNecessary(from, to, midPoint, transformation, interpolationTreshold)) {
    interpolatePointPair(from, midPoint, transformation, interpolationTreshold, interpolatedPoints);
    interpolatePointPair(midPoint, to, transformation, interpolationTreshold, interpolatedPoints);
  } else {
    const transformedFrom = transformation(from);
    interpolatedPoints.push(transformedFrom);
  }
}

function interpolatePoint (p1, p2, t) {
  return [
    p1[0] + (p2[0] - p1[0]) * t,
    p1[1] + (p2[1] - p1[1]) * t
  ]
}

function interpolationBetweenPointsNecessary (from, to, midPoint, transformation, interpolationTreshold) {
  const transformedFrom = transformation(from);
  const transformedTo = transformation(to);

  if (pointDistance(transformedFrom, transformedTo) > interpolationTreshold) {
    const twoPointsInBetween = [
      transformation(interpolatePoint(from, to, 0.33)),
      transformation(interpolatePoint(from, to, 0.66))
    ];

    return pointsOnOneLine([transformedFrom, transformedTo], twoPointsInBetween) === false
  }

  const transformedMidPoint = transformation(midPoint);

  return pointsCloseTogether(
    [transformedFrom, transformedMidPoint, transformedTo],
    interpolationTreshold
  ) === false
}

const LINE_TRESHOLD = 0.01;

function pointsOnOneLine (lineSegment, [secondPoint, thirdPoint]) {
  return (
    pointIntersectsLineSegment(secondPoint, lineSegment, LINE_TRESHOLD) &&
    pointIntersectsLineSegment(thirdPoint, lineSegment, LINE_TRESHOLD)
  )
}

function pointsCloseTogether (points, interpolationTreshold) {
  const [firstPoint, secondPoint, thirdPoint] = points;

  return (
    pointDistance(firstPoint, secondPoint) <= interpolationTreshold &&
    pointDistance(secondPoint, thirdPoint) <= interpolationTreshold
  )
}

function interpolatedTransformLinearRing (linearRing, transformation, settings) {
  if (!settings.simplify || linearRing.length < 3) {
    return interpolatedTransformLinearRingUnsimplified(linearRing, transformation, settings)
  }

  if (settings.simplify === true) {
    return interpolatedTransformLinearRingSimplified(linearRing, transformation, settings)
  }
}

function interpolatedTransformLinearRingUnsimplified (linearRing, transformation, settings) {
  const interpolatedLinearRing = [];

  let from;
  let to;

  for (let i = 0; i < linearRing.length - 1; i++) {
    from = linearRing[i];
    to = linearRing[i + 1];

    interpolatePointPair(
      from,
      to,
      transformation,
      settings.interpolationTreshold,
      interpolatedLinearRing
    );
  }

  interpolatedLinearRing.push(transformation(to));

  return interpolatedLinearRing
}

function interpolatedTransformLinearRingSimplified (linearRing, transformation, settings) {
  const interpolatedLinearRing = [];
  const simplificationTreshold = settings.simplificationTreshold || 1;

  let from = linearRing[0];
  let to;

  for (let i = 1; i < linearRing.length; i++) {
    to = linearRing[i];

    const dontSkip = pointDistance(
      transformation(from),
      transformation(to)
    ) >= simplificationTreshold;

    if (dontSkip) {
      interpolatePointPair(
        from,
        to,
        transformation,
        settings.interpolationTreshold,
        interpolatedLinearRing
      );

      from = to;
    }
  }

  interpolatedLinearRing.push(transformation(to));

  return interpolatedLinearRing
}

function interpolatedTransformSetOfLinearRings (linearRings, transformation, settings) {
  const interpolatedLinearRings = [];

  for (let i = 0; i < linearRings.length; i++) {
    interpolatedLinearRings.push(interpolatedTransformLinearRing(linearRings[i], transformation, settings));
  }

  return interpolatedLinearRings
}

function interpolatedTransformXYArrays ({ x, y }, transformation, settings) {
  if (!settings.simplify || x.length < 3) {
    return interpolatedTransformXYArraysUnsimplified(x, y, transformation, settings)
  }

  if (settings.simplify === true) {
    return interpolatedTransformXYArraysSimplified(x, y, transformation, settings)
  }
}

function interpolatedTransformXYArraysUnsimplified (x, y, transformation, settings) {
  const interpolatedLinearRing = [];

  let from;
  let to;

  for (let i = 0; i < x.length - 1; i++) {
    from = [x[i], y[i]];
    to = [x[i + 1], y[i + 1]];

    interpolatePointPair(
      from,
      to,
      transformation,
      settings.interpolationTreshold,
      interpolatedLinearRing
    );
  }

  interpolatedLinearRing.push(transformation(to));

  return interpolatedLinearRing
}

function interpolatedTransformXYArraysSimplified (x, y, transformation, settings) {
  const interpolatedLinearRing = [];
  const simplificationTreshold = settings.simplificationTreshold || 1;

  let from = [x[0], y[0]];
  let to;

  for (let i = 1; i < x.length; i++) {
    to = [x[i], y[i]];

    const dontSkip = pointDistance(
      transformation(from),
      transformation(to)
    ) >= simplificationTreshold;

    if (dontSkip) {
      interpolatePointPair(
        from,
        to,
        transformation,
        settings.interpolationTreshold,
        interpolatedLinearRing
      );

      from = to;
    }
  }

  interpolatedLinearRing.push(transformation(to));

  return interpolatedLinearRing
}

const interpolatedTransformFunctions = {
  interpolatedTransformLineString,
  interpolatedTransformMultiLineString,
  interpolatedTransformPolygon,
  interpolatedTransformMultiPolygon
};

function interpolatedTransfromGeometry (geometry, transformation, settings) {
  const functionName = 'interpolatedTransform' + geometry.type;
  return interpolatedTransformFunctions[functionName](geometry, transformation, settings)
}

function interpolatedTransformLineString (lineString, transformation, settings) {
  const input = getInput(lineString);

  if (input === 'geojson') {
    return {
      type: 'LineString',
      coordinates: interpolatedTransformLinearRing(lineString.coordinates, transformation, settings)
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'LineString',
      coordinates: interpolatedTransformXYArrays(lineString, transformation, settings)
    }
  }
}

function interpolatedTransformMultiLineString (multiLineString, transformation, settings) {
  const input = getInput(multiLineString);

  if (input === 'geojson') {
    return {
      type: 'MultiLineString',
      coordinates: interpolatedTransformSetOfLinearRings(multiLineString.coordinates, transformation, settings)
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'MultiLineString',
      coordinates: [
        interpolatedTransformXYArrays(multiLineString, transformation, settings)
      ]
    }
  }
}

function interpolatedTransformPolygon (polygon, transformation, settings) {
  const input = getInput(polygon);

  if (input === 'geojson') {
    return {
      type: 'Polygon',
      coordinates: interpolatedTransformSetOfLinearRings(polygon.coordinates, transformation, settings)
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'Polygon',
      coordinates: [
        interpolatedTransformXYArrays(polygon, transformation, settings)
      ]
    }
  }
}

function interpolatedTransformMultiPolygon (multiPolygon, transformation, settings) {
  const input = getInput(multiPolygon);

  if (input === 'geojson') {
    const polygons = multiPolygon.coordinates;
    const interpolatedPolygons = [];

    for (let i = 0; i < polygons.length; i++) {
      interpolatedPolygons.push(interpolatedTransformSetOfLinearRings(polygons[i], transformation, settings));
    }

    return {
      type: 'MultiPolygon',
      coordinates: interpolatedPolygons
    }
  }

  if (input === 'xyArrays') {
    return {
      type: 'MultiPolygon',
      coordinates: [
        [interpolatedTransformXYArrays(multiPolygon, transformation, settings)]
      ]
    }
  }
}

function transformGeometry (geometry, _transformation, settings = {}) {
  const transformation = settings.decimals
    ? point => roundPoint(_transformation(point), settings.decimals)
    : _transformation;

  if (!settings.interpolate) {
    return naiveTransformGeometry(geometry, transformation, settings)
  }

  if (settings.interpolate === true) {
    return interpolatedTransfromGeometry(geometry, transformation, settings)
  }
}

function roundPoint ([x, y], decimals) {
  const zeroes = 10 ** decimals;

  return [
    Math.round(x * zeroes) / zeroes,
    Math.round(y * zeroes) / zeroes
  ]
}

export { transformGeometry };

import pointAesthetics from '../Point/aesthetics.js'
import rectangleAesthetics from '../Rectangle/aesthetics.js'
import polygonAesthetics from '../Polygon/aesthetics.js'

import { isDefined } from 'equals.js'

export default function (type, aesthetics) {
  if (type === 'Point') {
    validateAesthetics(aesthetics, pointAesthetics)
  }

  if (type === 'Rectangle') {
    validateAesthetics(aesthetics, rectangleAesthetics)
  }

  if (type === 'Polygon') {
    validateAesthetics(aesthetics, polygonAesthetics)
  }

  return aesthetics
}

function validateAesthetics (passedAesthetics, allowedAesthetics) {
  for (const aestheticName in passedAesthetics) {
    const aestheticValue = passedAesthetics[aestheticName]

    if (isDefined(aestheticValue)) {
      if (!(aestheticName in allowedAesthetics)) throw aestheticNotAllowedError(aestheticName)
    }
  }
}

const aestheticNotAllowedError = name => {
  throw new Error(`Aesthetic '${name}' not allowed`)
}

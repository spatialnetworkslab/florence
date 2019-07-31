import pointAesthetics from '../Point/aesthetics.js'
import rectangleAesthetics from '../Rectangle/aesthetics.js'
import polygonAesthetics from '../Polygon/aesthetics.js'
import labelAesthetics from '../Label/aesthetics.js'

import { isDefined, isUndefined } from '../../../utils/equals.js'

export default function (type, aesthetics) {
  if (type === 'Point') {
    return validateAesthetics(aesthetics, pointAesthetics)
  }

  if (type === 'Rectangle') {
    return validateAesthetics(aesthetics, rectangleAesthetics)
  }

  if (type === 'Polygon') {
    return validateAesthetics(aesthetics, polygonAesthetics)
  }

  if (type === 'Label') {
    return validateAesthetics(aesthetics, labelAesthetics)
  }
}

function validateAesthetics (passedAesthetics, allowedAesthetics) {
  const aesthetics = {}

  for (const aestheticName in passedAesthetics) {
    const aestheticValue = passedAesthetics[aestheticName]
    const aestheticRequirements = allowedAesthetics[aestheticName]

    if (isDefined(aestheticValue)) {
      if (!(aestheticName in allowedAesthetics)) throw aestheticNotAllowedError(aestheticName)
      aesthetics[aestheticName] = aestheticValue
    }

    if (isUndefined(aestheticValue)) {
      if (aestheticName in allowedAesthetics) {
        if (aestheticRequirements.required) throw aestheticRequiredError(aestheticName)
        if (aestheticRequirements.default) {
          aesthetics[aestheticName] = aestheticRequirements.default
        } else {
          aesthetics[aestheticName] = aestheticValue
        }
      }
    }
  }

  return aesthetics
}

const aestheticNotAllowedError = name => {
  return new Error(`Aesthetic '${name}' not allowed`)
}

const aestheticRequiredError = name => {
  return new Error(`Required aesthetic '${name}' is missing`)
}

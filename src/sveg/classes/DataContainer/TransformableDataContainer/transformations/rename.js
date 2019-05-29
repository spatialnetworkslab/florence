
import { checkRegularColumnName } from '../../utils/checkFormat.js'
import { warn } from '../../../../utils/logging.js'

export default function (data, renameInstructions) {
  if (renameInstructions.constructor !== Object) {
    throw new Error('Rename only accepts an object')
  }

  for (let oldName in renameInstructions) {
    if (data.hasOwnProperty(oldName)) {
      let newName = renameInstructions[oldName]
      checkRegularColumnName(newName)
      data[newName] = data[oldName]
      delete data[oldName]
    } else {
      warn(`Rename: column '${oldName}' not found`)
    }
  }
}

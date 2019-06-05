import filter from './filter.js'
import { isInvalid } from '../../../../utils/equals.js'

export default function (data, dropInstructions) {
  let filterFunc

  if (dropInstructions === undefined) {
    // If the instructions are undefined, we will check all columns for invalid values
    filterFunc = row => {
      let keep = true

      for (let key in row) {
        let val = row[key]
        if (isInvalid(val)) {
          keep = false
          break
        }
      }

      return keep
    }
  } else if (dropInstructions.constructor === String) {
    // If the instructions are a string, we check only one column for invalid values
    checkIfColumnsExist(data, [dropInstructions])
    filterFunc = row => !isInvalid(row[dropInstructions])
  } else if (dropInstructions.constructor === Array) {
    // if the instructions are an array, we check the columns named in the array
    checkIfColumnsExist(data, dropInstructions)
    filterFunc = row => {
      let keep = true
      for (let col of dropInstructions) {
        if (isInvalid(row[col])) {
          keep = false
          break
        }
      }

      return keep
    }
  } else {
    throw new Error('dropNA can only be passed undefined, a String or an Array of Strings')
  }

  filter(data, filterFunc)
}

function checkIfColumnsExist (data, columns) {
  for (let col of columns) {
    if (!data.hasOwnProperty(col)) {
      throw new Error(`Column '${col}' not found`)
    }
  }
}

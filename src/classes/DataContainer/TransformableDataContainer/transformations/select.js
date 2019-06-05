export default function (data, selection) {
  if (selection.constructor === String) {
    selection = [selection]
  }

  if (selection.constructor === Array) {
    for (let key in data) {
      if (!selection.includes(key)) {
        delete data[key]
      }
    }
  } else {
    throw new Error('select can only be used with a string or array of strings')
  }
}

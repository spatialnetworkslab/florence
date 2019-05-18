export default function (data, selection) {
  if (selection.constructor === String) {
    return data[selection]
  } else if (selection.constructor === Array) {
    for (let key in data) {
      if (!selection.includes(key)) {
        delete data[key]
      }
    }

    return data
  } else {
    throw new Error('select can only be used with a string or array of strings')
  }
}

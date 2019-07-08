export default function (data) {
  let firstKey = Object.keys(data)[0]
  let firstColumn = data[firstKey]
  return firstColumn.length
}

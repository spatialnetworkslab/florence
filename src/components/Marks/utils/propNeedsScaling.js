export default function propNeedsScaling (prop) {
  return prop.constructor !== Function
}

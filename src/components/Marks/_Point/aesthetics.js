/**
 * Point props default and required or not are defined here.
 */

export default {
  x: {
    required: false
  },
  y: {
    required: false
  },
  geometry: {
    required: false
  },
  radius: {
    required: false,
    default: 3
  },
  fill: {
    required: false,
    default: 'black'
  },
  stroke: {
    required: false,
    default: 'none'
  },
  strokeWidth: {
    required: false,
    default: 0
  },
  fillOpacity: {
    required: false
  },
  strokeOpacity: {
    required: false
  },
  opacity: {
    required: false,
    default: 1
  }
}

export default function textAnchorPoint (anchorPoint) {
// For setting the anchor point on a SVG text element
  switch (anchorPoint) {
    case 'center':
      return { textAnchor: 'middle', dominantBaseline: 'middle' }
    case 'lb':
      return { textAnchor: 'start', dominantBaseline: 'alphabetic' }
    case 'lt':
      return { textAnchor: 'start', dominantBaseline: 'hanging' }
    case 'rt':
      return { textAnchor: 'end', dominantBaseline: 'hanging' }
    case 'rb':
      return { textAnchor: 'end', dominantBaseline: 'alphabetic' }
    case 'l':
      return { textAnchor: 'start', dominantBaseline: 'middle' }
    case 'r':
      return { textAnchor: 'end', dominantBaseline: 'middle' }
    case 'b':
      return { textAnchor: 'middle', dominantBaseline: 'alphabetic' }
    case 't':
      return { textAnchor: 'middle', dominantBaseline: 'hanging' }
    default: {
      return { textAnchor: 'middle', dominantBaseline: 'middle' }
    }
  }
}

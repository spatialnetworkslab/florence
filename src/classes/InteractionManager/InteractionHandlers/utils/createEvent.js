const INTERESTING_NATIVE_KEYS = [
  'altKey', 'ctrlKey', 'shiftKey',
  'clientX', 'clientX',
  'pageX', 'pageY',
  'screenX', 'screenY',
  'timeStamp'
]

export default function createEvent (eventType, eventOptions, nativeEvent) {
  const event = eventOptions

  event.type = eventType
  event.nativeType = nativeEvent.type

  for (const key of INTERESTING_NATIVE_KEYS) {
    event[key] = nativeEvent[key]
  }

  return event
}

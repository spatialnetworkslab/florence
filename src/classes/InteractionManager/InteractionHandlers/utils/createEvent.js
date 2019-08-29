const INTERESTING_NATIVE_KEYS = [
  'altKey', 'ctrlKey', 'shiftKey',
  'clientX', 'clientX',
  'pageX', 'pageY',
  'screenX', 'screenY',
  'timeStamp'
]

export function createClickEvent (eventOptions, nativeEvent) {
  const event = eventOptions

  event.type = 'click'
  event.nativeType = nativeEvent.type

  for (const key of INTERESTING_NATIVE_KEYS) {
    event[key] = nativeEvent[key]
  }

  return event
}

export function createMarkEvent (eventType, eventOptions, hit, nativeEvent) {
  eventOptions.markType = hit.markType
  eventOptions.hitBbox = extractBbox(hit)
  eventOptions.hitSource = 'mark'

  return createEvent(eventType, eventOptions, nativeEvent)
}

export function createLayerEvent (eventType, eventOptions, hit, nativeEvent) {
  eventOptions.markType = hit.markType
  eventOptions.hitBbox = extractBbox(hit)
  eventOptions.key = hit.key
  eventOptions.index = hit.index
  eventOptions.hitSource = 'layer'

  return createEvent(eventType, eventOptions, nativeEvent)
}

export function createSectionEvent (eventType, eventOptions, nativeEvent) {
  eventOptions.hitSource = 'section'

  return createEvent(eventType, eventOptions, nativeEvent)
}

function extractBbox (hit) {
  return { minX: hit.minX, maxX: hit.maxX, minY: hit.minY, maxY: hit.maxY }
}

function createEvent (eventType, eventOptions, nativeEvent) {
  const event = eventOptions

  event.type = eventType
  event.nativeType = nativeEvent.type

  for (const key of INTERESTING_NATIVE_KEYS) {
    event[key] = nativeEvent[key]
  }

  return event
}

const INTERESTING_NATIVE_KEYS = [
  'altKey', 'ctrlKey', 'shiftKey',
  'clientX', 'clientY',
  'pageX', 'pageY',
  'screenX', 'screenY',
  'timeStamp'
]

export function createSelectMarkEvent (eventType, hit) {
  const event = {
    type: eventType,
    markType: hit.markType,
    hitSource: 'mark'
  }

  return event
}

export function createSelectLayerEvent (eventType, hit) {
  const event = {
    type: eventType,
    markType: hit.markType,
    key: hit.key,
    index: hit.index,
    hitSource: 'layer'
  }

  return event
}

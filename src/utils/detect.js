// Taken from https://github.com/rafgraph/detect-it/blob/main/src/index.ts

const w = typeof window !== 'undefined' ? window : { screen: {}, navigator: {} }
const matchMedia = w.matchMedia || (() => ({ matches: false }))

let passiveOptionAccessed = false
const options = {
  get passive () {
    return (passiveOptionAccessed = true)
  }
}

const noop = () => {}
w.addEventListener && w.addEventListener('p', noop, options)
w.removeEventListener && w.removeEventListener('p', noop, false)

export const supportsPassiveEvents = passiveOptionAccessed

export const supportsPointerEvents = 'PointerEvent' in w

const onTouchStartInWindow = 'ontouchstart' in w
const touchEventInWindow = 'TouchEvent' in w

export const supportsTouchEvents =
  onTouchStartInWindow || (touchEventInWindow && matchMedia('(any-pointer: coarse)').matches)

const hasTouch = (w.navigator.maxTouchPoints || 0) > 0 || supportsTouchEvents

const userAgent = w.navigator.userAgent || ''

const isIPad =
  matchMedia('(pointer: coarse)').matches &&
  /iPad|Macintosh/.test(userAgent) &&
  Math.min(w.screen.width || 0, w.screen.height || 0) >= 768

const hasCoarsePrimaryPointer =
  (matchMedia('(pointer: coarse)').matches ||
  (!matchMedia('(pointer: fine)').matches && onTouchStartInWindow)) &&
  !/Windows.*Firefox/.test(userAgent)

const hasAnyHoverOrAnyFinePointer =
  matchMedia('(any-pointer: fine)').matches ||
  matchMedia('(any-hover: hover)').matches ||
  isIPad || !onTouchStartInWindow

export const deviceType =
  hasTouch && (hasAnyHoverOrAnyFinePointer || !hasCoarsePrimaryPointer)
    ? 'hybrid'
    : hasTouch
      ? 'touchOnly'
      : 'mouseOnly'

export const primaryInput =
  deviceType === 'mouseOnly'
    ? 'mouse'
    : deviceType === 'touchOnly'
      ? 'touch'
      : hasCoarsePrimaryPointer
        ? 'touch'
        : 'mouse'

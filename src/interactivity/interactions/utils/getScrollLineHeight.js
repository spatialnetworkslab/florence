// Taken from:
// https://stackoverflow.com/a/37474225/7237112

export default function getScrollLineHeight () {
  var r
  var iframe = document.createElement('iframe')
  iframe.src = '#'
  document.body.appendChild(iframe)
  var iwin = iframe.contentWindow
  var idoc = iwin.document
  idoc.open()
  idoc.write('<!DOCTYPE html><html><head></head><body><span>a</span></body></html>')
  idoc.close()
  var span = idoc.body.firstElementChild
  r = span.offsetHeight
  document.body.removeChild(iframe)

  return r
}

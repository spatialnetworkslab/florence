// https://stackoverflow.com/a/33852627/7237112
export function calculateCentroidLinearRing (pts) {
  const nPts = pts.length
  const off = pts[0]
  let twicearea = 0
  let x = 0
  let y = 0
  let p1
  let p2
  let f

  for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = pts[i]
    p2 = pts[j]
    f = (p1[0] - off[0]) * (p2[1] - off[1]) - (p2[0] - off[0]) * (p1[1] - off[1])
    twicearea += f
    x += (p1[0] + p2[0] - 2 * off[0]) * f
    y += (p1[1] + p2[1] - 2 * off[1]) * f
  }

  f = twicearea * 3

  return [x / f + off[0], y / f + off[1]]
}

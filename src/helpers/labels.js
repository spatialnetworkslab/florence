export function getClassLabels (thresholdColorScale, format = x => x) {
  const domain = thresholdColorScale.domain()

  const labels = [`< ${format(domain[0])}`]

  for (let i = 0; i < domain.length - 1; i++) {
    labels.push(`${format(domain[i])} - ${format(domain[i + 1])}`)
  }

  labels.push(`≥ ${format(domain[domain.length - 1])}`)

  return labels
}

export function interpolateLabels (linearColorScale, numberOfLabels) {

}

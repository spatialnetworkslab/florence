import TestComponent from './components/marks/TestComponent.svelte'
import {
  render,
  fireEvent
} from '@testing-library/svelte'

export function renderMark (
  component,
  componentProps,
  graphicProps,
  renderOptions
) {
  return render(
    TestComponent,
    {
      component,
      componentProps,
      graphicProps
    },
    renderOptions
  )
}

export const renderLayer = renderMark

export {
  render,
  fireEvent
}

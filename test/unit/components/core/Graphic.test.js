import { render } from '../../utils'
import { Graphic } from '../../../../src/index.js'

describe('Graphic', () => {
  it('renders', () => {
    const { getByTestId } = render(Graphic, {
      width: 500,
      height: 500
    })

    expect(getByTestId('root')).toBeInTheDocument()
  })
})

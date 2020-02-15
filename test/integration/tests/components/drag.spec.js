/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/drag')
  })

  describe('Drag Tests', () => {
    it('[interaction] drag works', () => {
      cy.get('circle.point').then($point => {
        const initcx = parseFloat($point.attr('cx'))
        const initcy = parseFloat($point.attr('cy'))

        cy.get('circle.point')
          .trigger('mousedown', { which: 1 })
          .trigger('mousemove', { which: 1, clientX: 450, clientY: 450, force: true })
          .trigger('mouseup')
          .then(() => {
            const finalcx = parseFloat($point.attr('cx'))
            const finalcy = parseFloat($point.attr('cy'))

            expect(finalcx).to.not.equal(initcx)
            expect(finalcy).to.not.equal(initcy)
          })
      })
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/nestedsections')
  })

  describe('Nested Section Tests', () => {
    it('[render] nested sections rendered', () => {
      cy.get('.section > .section').should('have.length', 3)
    })

    it('[render] nested sections positioned correctly', () => {
      cy.get('.section > .section > .content-background').each(($el, idx) => {
        const midpoint = +$el.attr('x') + (+$el.attr('width') / 2)

        cy.get('.x-axis > .label-layer > .label').then($arr => {
          const labelXPos = +Cypress.dom.wrap($arr[idx]).attr('x')
          expect(labelXPos).to.be.closeTo(midpoint, 0.01)
        })
      })
    })

    // it('[render] nested sections snapshot correctly', () => {
    //   cy.get('svg').toMatchSnapshot()
    // })
  })
})

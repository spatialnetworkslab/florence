/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/area')
  })

  describe('Area Tests', () => {
    it('[render] area rendered', () => {
      cy.get('.area').should('have.length', 1)
    })

    // it('[render] area snapshot correctly', () => {
    //   cy.get('svg').toMatchSnapshot()
    // })

    it('[interaction] hovering over area changes color', () => {
      const area = cy.get('.area').first()
      area.should('have.attr', 'fill', 'steelblue')
      area.trigger('mousemove')
      area.should('have.attr', 'fill', '#d5896f')
    })
  })
})

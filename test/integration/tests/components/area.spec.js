/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/area')
  })

  describe('Area Tests', () => {
    it('[render] area rendered', () => {
      cy.get('.area').should('have.length', 1)
    })

    it('[interaction] hovering over area changes color', () => {
      const area = cy.get('.area').first()
      area.should('have.attr', 'fill', 'rgba(8,24,46,1)')
      area.trigger('mousemove')
      area.should('have.attr', 'fill', 'rgba(39,127,245,1)')
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/arealayer')
  })

  describe('AreaLayer Tests', () => {
    it('[render] area layer rendered', () => {
      cy.get('.area').should('have.length', 2)
    })

    it('[interaction] hovering over area layer changes color', () => {
      const area = cy.get('.area').first()
      area.should('have.attr', 'fill', '#af8dc3')
      area.trigger('mousemove')
      area.should('have.attr', 'fill', '#eee0cb')
    })
  })
})

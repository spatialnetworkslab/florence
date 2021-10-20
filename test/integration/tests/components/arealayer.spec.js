/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/arealayer')
  })

  describe('AreaLayer Tests', () => {
    it('[render] area layer rendered', () => {
      cy.get('.area-layer > path').should('have.length', 2)
    })

    it('[interaction] hovering over area layer changes color', () => {
      const area = cy.get('.area-layer > path').first()
      area.should('have.attr', 'fill', 'rgba(175,141,195,1)')
      area.trigger('mousemove')
      area.should('have.attr', 'fill', 'rgba(238,224,203,1)')
    })
  })
})

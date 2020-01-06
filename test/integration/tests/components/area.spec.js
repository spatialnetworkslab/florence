/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/area')
  })

  describe('Area Tests', () => {
    it('[render] area rendered', () => {
      cy.get('.area').should('have.length', 1)
    })

    it('[render] area snapshot correctly', () => {
      cy.get('svg').snapshot({ name: 'svg with 1 area mark' })
    })

    it('[interaction] hovering over area changes color', () => {
      cy.get('.area').should('have.attr', 'fill', 'steelblue')
      cy.get('.area').trigger('mousemove')
      cy.get('.area').should('have.attr', 'fill', '#d5896f')
      cy.get('.left-col').trigger('mousemove')
      cy.get('.area').should('have.attr', 'fill', 'steelblue')
    })
  })
})

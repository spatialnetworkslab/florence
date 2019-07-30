/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/geo')
  })

  describe('Geo Tests', () => {
    it('[render] polygons rendered', () => {
      cy.get('.polygon').should('have.length', 3)
    })
    it('[render] geo polygons correctly', () => {
      cy.get('svg')
        .snapshot({ name: 'svg with 3 geo polygons' })
    })
  })
})

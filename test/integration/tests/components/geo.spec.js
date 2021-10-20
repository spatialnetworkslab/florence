/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/geo')
  })

  describe('Geo Tests', () => {
    it('[render] polygons rendered', () => {
      cy.get('.polygon-layer > path').should('have.length', 3)
    })
  })
})

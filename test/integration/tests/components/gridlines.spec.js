/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/gridlines')
  })

  describe('GridLines Tests', () => {
    it('[render] gridlines has correct number of grid lines', () => {
      cy.get('g.x-grid-lines > .line-layer > path').should('have.length', 11)
      cy.get('g.y-grid-lines > .line-layer > path').should('have.length', 11)
    })
  })
})

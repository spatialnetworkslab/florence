/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/gridlines')
  })

  describe('GridLines Tests', () => {
    it('[render] gridlines rendered', () => {
      cy.get('g.x-grid-lines').should('have.length', 1)
      cy.get('g.y-grid-lines').should('have.length', 1)
    })


    it('[render] gridlines has correct number of grid lines', () => {
      cy.get('g.x-grid-lines > .line-layer > .line').should('have.length', 11)
      cy.get('g.y-grid-lines > .line-layer > .line').should('have.length', 11)
    })
  })
})

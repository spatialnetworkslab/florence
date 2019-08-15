/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/axes')
  })

  describe('Axes Tests', () => {
    it('[render] axes rendered', () => {
      cy.get('g.x-axis').should('have.length', 1)
      cy.get('g.y-axis').should('have.length', 1)
    })

    it('[render] axis has title', () => {
      cy.get('g.x-axis > .label').should('have.length', 1)
    })

    it('[render] axis has tick marks', () => {
      cy.get('g.x-axis > .line-layer > .line').should('have.length.greaterThan', 6)
    })

    it('[render] axis has tick labels', () => {
      cy.get('g.x-axis > .label-layer > .label').should('have.length.greaterThan', 6)
    })
  })
})

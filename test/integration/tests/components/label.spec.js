/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/label-mark')
  })

  describe('Label Mark Tests', () => {
    it('[render] labels rendered', () => {
      cy.get('.label').should('have.length', 4)
    })

    it('[render] labels has correct text', () => {
      cy.get('.label').last().should('contain', 'Testing3')
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/nestedsections')
  })

  describe('Nested Section Tests', () => {
    it('[render] nested sections rendered', () => {
      cy.get('.section > .section > .section').should('have.length', 3)
    })
  })
})

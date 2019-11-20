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

    // interaction TODO
  })
})

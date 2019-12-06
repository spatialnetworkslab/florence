/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/title')
  })

  describe('Title Tests', () => {
    it('[render] titles rendered', () => {
      cy.get('.label').should('have.length', 4)
    })

    it('[render] another title has correct text', () => {
      cy.get('.label').should('contain', 'Lorem ipsum dolor sit amet')
    })

    it('[render] another title has correct text', () => {
      cy.get('.label').last().should('contain', 'elit, sed do eiusmod tempor incididunt')
    })

    it('[render] labels snapshot correctly', () => {
      cy.get('svg')
        .snapshot({ name: 'svg with 4 text labels' })
    })
  })
})

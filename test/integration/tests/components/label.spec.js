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

    it('[render] labels snapshot correctly', () => {
      cy.get('svg')
        .snapshot({ name: 'svg with 4 text labels' })
    })

    it('[interaction] clicking on label changes color', () => {
      var label = cy.get('.label').first()
      label.should('have.attr', 'fill', 'yellow')
      label.click()
      label.should('have.attr', 'fill', 'blue')
    })
  })
})

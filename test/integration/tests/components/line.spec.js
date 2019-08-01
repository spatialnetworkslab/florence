/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/line')
  })

  describe('Line tests', () => {
    it('[render] lines rendered', () => {
      cy.get('.line').should('have.length', 2)
    })

    it('[interaction] clicking on line changes color', () => {
      const line = cy.get('./line').first()
      line.should('have.attr', 'fill', 'red')
      line.click()
      line.should('have.attr', 'fill', 'green')
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/line')
  })

  describe('Line tests', () => {
    it('[render] lines rendered', () => {
      cy.get('.line-test path').should('have.length', 2)
    })

    it('[interaction] clicking on line changes color', () => {
      const line = cy.get('.line-test path').first()
      line.should('have.attr', 'stroke', 'rgba(255,0,0,1)')
      line.click(1, 1, { force: true })
      line.should('have.attr', 'stroke', 'rgba(0,128,0,1)')
    })
  })
})

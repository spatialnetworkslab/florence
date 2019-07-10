/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/rectangles')
  })

  describe('Rectangle Tests', () => {
    it('[render] rectangles rendered', () => {
      // https://on.cypress.io/should
      cy.get('.rectangle').should('have.length', 3)
    })

    it('[interaction] clicking on rectangle changes color', () => {
      var rectangle = cy.get('.rectangle').first()
      rectangle.should('have.attr', 'fill', 'yellow')
      rectangle.click()
      rectangle.should('have.attr', 'fill', 'blue')
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/rectangles')
  })

  describe('Rectangle Tests', () => {
    it('[render] rectangles rendered', () => {
      cy.get('.rectangle-layer > path').should('have.length', 3)
    })

    it('[interaction] clicking on rectangle changes color', () => {
      const rectangle = cy.get('.rectangle-layer > path').first()
      rectangle.should('have.attr', 'fill', 'rgba(255,255,0,1)')
      rectangle.click()
      rectangle.should('have.attr', 'fill', 'rgba(0,0,255,1)')
    })
  })
})

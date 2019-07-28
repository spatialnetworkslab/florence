/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/label-mark')
  })

  describe('Label Mark Tests', () => {
    it('[render] rectangles rendered', () => {
      cy.get('.label').should('have.length', 1)
    })

    // it('[interaction] clicking on rectangle changes color', () => {
    //   var rectangle = cy.get('.rectangle').first()
    //   rectangle.should('have.attr', 'fill', 'yellow')
    //   rectangle.click()
    //   rectangle.should('have.attr', 'fill', 'blue')
    // })
  })
})

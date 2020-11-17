/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/rectangles')
  })

  describe('Rectangle Tests', () => {
    it('[render] rectangles rendered', () => {
      cy.get('.rectangle').should('have.length', 3)
    })

    // it('[render] rectangles snapshot correctly', () => {
    //   cy.get('svg')
    //     .toMatchSnapshot()
    // })

    it('[interaction] clicking on rectangle changes color', () => {
      var rectangle = cy.get('.rectangle').first()
      rectangle.should('have.attr', 'fill', 'yellow')
      rectangle.click()
      rectangle.should('have.attr', 'fill', 'blue')
    })
  })
})

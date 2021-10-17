/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/label')
  })

  describe('Label Tests', () => {
    it('[render] labels rendered', () => {
      cy.get('.test-labels text').should('have.length', 4)
    })

    it('[render] labels has correct text', () => {
      cy.get('.test-labels text').last().should('contain', 'Testing3')
    })

    // it('[interaction] clicking on label changes color', () => {
    //   const label = cy.get('.test-labels text').first()
    //   label.should('have.attr', 'fill', 'rgba(255,255,0,1)')
    //   label.click()
    //   label.should('have.attr', 'fill', 'rgba(0,0,255,1)')
    // })
  })
})

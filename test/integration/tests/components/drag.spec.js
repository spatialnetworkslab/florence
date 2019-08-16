/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/drag')
  })

  describe('Drag Tests', () => {
    it('[interaction] drag works', () => {
      cy.get('circle.point')
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { which: 1, clientX: 450, clientY: 450, force: true })
        .trigger('mouseup')
      cy.get('circle.point').invoke('attr', 'cx').should('be.greaterThan', 250)
      cy.get('circle.point').invoke('attr', 'cy').should('be.greaterThan', 250)
    })
  })
})

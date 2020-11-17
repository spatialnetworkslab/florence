/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/area')
  })

  describe('Area Tests', () => {
    it('[render] area rendered', () => {
      cy.get('.area').should('have.length', 1)
    })

    it('[render] area snapshot correctly', () => {
      cy.get('svg').toMatchSnapshot()
    })

    it('[interaction] hovering over area changes color', () => {
      cy.get('.area').then(($area) => {
        const originalFill = $area.attr('fill')
        cy.wrap($area).trigger('mousemove').its('fill').should('not.be', originalFill)
        cy.get('.left-col').trigger('mousemove') // unhovers by moving cursor to sidebar
        cy.wrap($area).its('fill').should('be', originalFill)
      })
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/arealayer')
  })

  describe('AreaLayer Tests', () => {
    it('[render] area layer rendered', () => {
      cy.get('.area').should('have.length', 2)
    })

    it('[render] area layer snapshot correctly', () => {
      cy.get('svg').toMatchSnapshot()
    })

    it('[interaction] hovering over area layer changes color', () => {
      cy.get('.area').first().then(($area) => {
        const originalFill = $area.attr('fill')
        cy.wrap($area).trigger('mousemove').its('fill').should('not.be', originalFill)
        cy.get('.left-col').trigger('mousemove') // unhovers by moving cursor to sidebar
        cy.wrap($area).its('fill').should('be', originalFill)
      })
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/legends')
  })

  describe('Title Tests', () => {
    it('[render] legends rendered', () => {
      cy.get('.discrete-legend').should('have.length', 2)
      cy.get('.gradient-legend').should('have.length', 2)
    })

    it('[render] legends have title', () => {
      cy.get('g.discrete-legend > .label').should('have.length', 2)
      cy.get('g.gradient-legend > .label').should('have.length', 2)
      cy.get('g.gradient-legend > .label').should('contain', 'Test title 12345')
    })

    it('[render] discrete legend has rectangles', () => {
      cy.get('g.discrete-legend > g.rectangle-layer').should('have.length', 2)
      cy.get('g.discrete-legend > g.rectangle-layer > path.rectangle').should('have.length.greaterThan', 2)
    })

    it('[render] gradient legend has rectangles with gradients', () => {
      cy.get('g.gradient-legend > path.rectangle').should('have.length', 2)
      cy.get('g.gradient-legend > defs > linearGradient > stop').should('have.length.greaterThan', 2)
      cy.get('g.gradient-legend > defs > linearGradient > stop').should('have.css', 'stop-color')
      cy.get('g.gradient-legend > defs > linearGradient > stop').should('have.css', 'stop-opacity')
    })

    it('[render] legends have tick labels', () => {
      cy.get('g.discrete-legend > .label-layer > .label').should('have.length.greaterThan', 1)
      cy.get('g.gradient-legend > .label-layer > .label').should('have.length.greaterThan', 1)
    })
  })
})

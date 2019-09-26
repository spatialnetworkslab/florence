/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/scale-band-axes')
  })

  describe('Axes Tests', () => {
    it('[render] tick marks are centred', () => {
      cy.get('g.x-axis > .line-layer > .line').eq(0).invoke('attr', 'd').should('be.equal', 'M151.73913043478257,475.5L151.73913043478257,481.5')
      cy.get('g.x-axis > .line-layer > .line').eq(1).invoke('attr', 'd').should('be.equal', 'M348.26086956521743,475.5L348.26086956521743,481.5')
    }) 

    it('[render] tick labels are centred', () => {
      cy.get('g.x-axis > .label-layer > .label').eq(0).invoke('attr', 'x').should('be.equal', '151.73913043478257')
      cy.get('g.x-axis > .label-layer > .label').eq(1).invoke('attr', 'x').should('be.equal', '348.26086956521743')
    })
  })
})

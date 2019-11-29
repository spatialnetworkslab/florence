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

    it('[interaction] mousing down and up over rectangle changes stroke and stroke-width', () => {
      var rect = cy.get('.rectangle').first()
      rect.should('have.attr', 'stroke', 'none')
      rect.should('have.attr', 'stroke-width', '0')
      rect.trigger('mousedown')
      rect.should('have.attr', 'stroke', '#7fc97f')
      rect.should('have.attr', 'stroke-width', '2')
      rect.trigger('mouseup')
      rect.should('have.attr', 'stroke', 'none')
      rect.should('have.attr', 'stroke-width', '0')
    })
  })
})

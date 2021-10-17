/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/scale-band-axes')
  })

  describe('Axes Tests', () => {
    it('[render] tick marks are centred', () => {
      cy.get('g.x-axis > .line-layer > path').eq(0).invoke('attr', 'd').should('be.equal', 'M152,476L152,481')
      cy.get('g.x-axis > .line-layer > path').eq(1).invoke('attr', 'd').should('be.equal', 'M348,476L348,481')
    })

    it('[render] tick labels are centred', () => {
      cy.get('g.x-axis > .label-layer > text').eq(0).invoke('attr', 'x').should('be.equal', '152')
      cy.get('g.x-axis > .label-layer > text').eq(1).invoke('attr', 'x').should('be.equal', '348')
    })

    it('[interaction] mousing down over rectangle changes stroke and stroke-width', () => {
      const rect = cy.get('.rectangle').first()
      rect.trigger('mousedown')
      rect.should('have.attr', 'stroke', 'rgba(127,201,127,1)')
      rect.should('have.attr', 'stroke-width', '2')
    })
  })
})

/// <reference types="Cypress" />

context('Assertions', () => {
  beforeEach(() => {
    cy.visit('/zoom')
  })

  describe('Zoom Tests', () => {
    it('[interaction] pan works', () => {
      cy.get('svg').trigger('mouseover')
        .trigger('mousedown')
        .trigger('mousemove', 100, 50)
        .trigger('mouseup')
        .snapshot({ name: 'pan' })
    })

    it('[interaction] pan works', () => {
      cy.get('svg').trigger('mouseover')
        .trigger('wheel', { clientX: 200, clientY: 300, deltaMode: 0, deltaY: 100 })
        .snapshot({ name: 'zoom' })
    })
  })
})

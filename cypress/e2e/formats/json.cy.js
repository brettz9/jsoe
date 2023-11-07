describe('JSON spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('Attempts bad JSON key (sparse array)', () => {
    cy.get('#attemptBadJSON').click();
    cy.get('dialog[open]').should(
      'contain',
      'The object to be added had types not supported by the current format.'
    );
  });
});

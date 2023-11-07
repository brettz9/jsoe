describe('indexedDBKey spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('Attempts bad indexedDB key (invalid Date)', () => {
    cy.get('#attemptBadIndexedDBKey').click();
    cy.get('dialog[open]').should(
      'contain',
      'The object to be added had types not supported by the current format.'
    );
    cy.get('dialog[open] .submit button').click();
    cy.get('dialog[open]').should('not.exist');
  });

  it('Attempts bad indexedDB key (String object)', () => {
    cy.get('#attemptBadIndexedDBKeyStringObject').click();
    cy.get('dialog[open]').should(
      'contain',
      'The object to be added had types not supported by the current format.'
    );
  });
});

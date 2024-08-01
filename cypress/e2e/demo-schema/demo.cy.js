describe('Demo spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('Opens schema boolean option', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );
    cy.get('#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'true');
  });
});

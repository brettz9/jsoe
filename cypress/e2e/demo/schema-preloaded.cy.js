describe('Demo spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/schema-preloaded.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('Selects true', function () {
    const sel = 'form ';
    cy.get(
      sel + 'input[name="demo-type-choices-only-initial-value-boolean1"]'
    ).should('be.checked');
  });
});

describe('Set spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-instrumented.html');
  });
  it('passes', () => {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select('set');
    cy.get(sel + '.addArrayElement').click();
    cy.get('.arrayItems .typeChoices-demo-keypath-not-expected').select('null');
    cy.get(sel + '.addArrayElement').click();
    cy.get('.arrayItems fieldset:nth-of-type(2) ' +
      '.typeChoices-demo-keypath-not-expected').select('true');
  });
});

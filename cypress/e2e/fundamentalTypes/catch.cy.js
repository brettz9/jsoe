describe('Catch spec (schemas)', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 7');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Catch (A catch)'
    );

    cy.typeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'xyz'
    );

    cy.get('button#viewUI').click();
    cy.get(
      '#viewUIResults .defaultValue > span'
    ).should(($elem) => {
      expect($elem.text()).to.equal('xyz');
      expect($elem.attr('title')).to.equal('An overpassed string');
    });

    cy.get(
      '#viewUIResults .catchValue > span'
    ).should(($elem) => {
      expect($elem.text()).to.equal('abc');
      expect($elem.attr('title')).to.equal('(catch value)');
    });
  });
});

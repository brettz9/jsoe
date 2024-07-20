describe('boolean spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('creates form control', () => {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );
    cy.get(sel + 'div[data-type="boolean"] input[value="true"]').should(
      'be.checked'
    );
  });

  it('creates form control (with `defaultValue`)', () => {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 6');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );
    cy.get(sel + 'div[data-type="boolean"] input[value="false"]').should(
      'be.checked'
    );
  });

  it('gets type', function (done) {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    cy.on('window:alert', (t) => {
      expect(t).to.eq('boolean');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );

    cy.get('button#getType').click();
  });

  it('is valid', function (done) {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    cy.on('window:alert', (t) => {
      expect(t).to.eq(true);
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );
    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', true);
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults i[data-type="boolean"]').should('exist');
  });

  it('gets value', function () {
    cy.clearTypeAndBlur('#getValueForString', 'false');
    cy.get('@consoleLog').should('be.calledWith', false);
  });
});

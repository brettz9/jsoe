describe('NaN spec', () => {
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
      'nan'
    );
    cy.get('input[name="demo-keypath-not-expected-nan"]').should(
      'be.checked'
    );
  });

  it('gets type', function (done) {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    cy.on('window:alert', (t) => {
      expect(t).to.eq('nan');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'nan'
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
      'nan'
    );
    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'nan'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', Number.NaN);
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'nan'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults i[data-type="nan"]').should('exist');
    cy.get('#viewUIResults i[data-type="nan"]').should(($i) => {
      expect($i.attr('title')).to.equal('A NaN');
    });
  });

  it('views UI (without description)', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 9');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'nan'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults i[data-type="nan"]').should('exist');
    cy.get('#viewUIResults i[data-type="nan"]').should(($i) => {
      expect($i.attr('title')).to.equal('(a `NaN`)');
    });
  });

  it('gets value', function () {
    cy.clearTypeAndBlur('#getValueForString', 'NaN');
    cy.get('@consoleLog').should('be.calledWith', Number.NaN);
  });
});

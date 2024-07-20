describe('number spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('creates form control', () => {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'number'
    );
    cy.get('input[name="demo-keypath-not-expected-number"]').should(
      'exist'
    );
  });

  it('gets type', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq('number');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'number'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-number"]',
      '123.45'
    );

    cy.get('button#getType').click();
  });

  it('is valid', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq(true);
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'number'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-number"]',
      '123.45'
    );
    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'number'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-number"]',
      '123.45'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', 123.45);
  });

  it('views UI', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'number'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-number"]',
      '123.45'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults i[data-type="number"]').should('exist');
    cy.get('#viewUIResults i[data-type="number"]').should('contain', '123.45');
  });

  it('gets value', function () {
    cy.clearTypeAndBlur('#getValueForString', '123.45');
    cy.get('@consoleLog').should('be.calledWith', 123.45);
  });

  // For the "Type choices with initial value set" control
  it('gets a value set onload', function () {
    cy.get(
      'input[name="demo-type-choices-only-initial-value-number"]'
    ).should(($input) => {
      expect($input.val()).to.equal('42');
    });
  });
});

describe('number spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'number'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-number"]',
      '123.45'
    );

    cy.get('#viewUIResults i[data-type="number"]').then((elem) => {
      expect(elem.attr('title')).to.equal('A number');
    });

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults i[data-type="number"]').should('exist');
    cy.get('#viewUIResults i[data-type="number"]').should('contain', '123.45');
  });
});

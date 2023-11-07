describe('date spec', () => {
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
      'date'
    );
    cy.get('input[name="demo-keypath-not-expected-date"]').should(
      'exist'
    );
  });

  it('creates form control for valid date', () => {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + '.formatChoices').select('indexedDBKey');
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'ValidDate'
    );
    cy.get('input[name="demo-keypath-not-expected-date"]').should(
      'exist'
    );
  });

  it('gets type', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq('date');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'date'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-date"]',
      '1999-01-01'
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
      'date'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-date"]',
      '1999-01-01'
    );
    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'date'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-date"]',
      '1999-01-01'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', new Date('1999-01-01'));
  });

  it('logs invalid date value', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'date'
    );
    cy.get(
      'input[name="demo-keypath-not-expected-invalidDate"]'
    ).click();

    cy.get('button#logValue').click();
    cy.get('button#logValue').click();
    cy.get('button#logValue').click();
    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', new Date('Invalid Date'));
  });

  it('views UI', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'date'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-date"]',
      '1999-01-01'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults i[data-type="date"]').should('exist');
    cy.get('#viewUIResults i[data-type="date"]').should(
      'contain', '1999-01-01'
    );
  });

  it('views UI for invalid date', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'date'
    );
    cy.get(
      'input[name="demo-keypath-not-expected-invalidDate"]'
    ).click();

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults i[data-type="date"]').should('exist');
    cy.get('#viewUIResults i[data-type="date"]').should(
      'contain', 'InvalidDate'
    );
  });

  it('gets value', function () {
    cy.clearTypeAndBlur('#getValueForString', '1999-01-01');
    cy.get('@consoleLog').should('be.calledWith', new Date('1999-01-01'));
  });

  it('gets value for ValidDate', function () {
    cy.get('#useIndexedDBKey').click();
    cy.clearTypeAndBlur('#getValueForString', '1999-01-01');
    cy.get('@consoleLog').should('be.calledWith', new Date('1999-01-01'));
  });

  // For the "Type choices with initial value set" control
  it('gets a value set onload', function () {
    cy.get(
      'input[name="demo-type-choices-only-initial-value-date"]'
    ).should(($input) => {
      expect($input.val()).to.equal('1999-01-01');
    });
  });

  it('gets an invalid value set onload', function () {
    cy.get(
      'input[name="demo-type-choices-only-initial-value-invalidDate"]'
    ).should('be.checked');
  });
});

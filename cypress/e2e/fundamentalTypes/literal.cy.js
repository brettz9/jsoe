describe('literal (number) spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('creates form control', () => {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal number)'
    );
    cy.get('input[name="demo-keypath-not-expected-number"]').should(
      'exist'
    );
  });

  it('gets type', function (done) {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');
    cy.on('window:alert', (t) => {
      expect(t).to.eq('literal');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal number)'
    );

    cy.get('button#getType').click();
  });

  it('is valid', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq(true);
      done();
    });
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal number)'
    );

    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal number)'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', 135);
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal number)'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="literal"]').should('exist');
    cy.get('#viewUIResults span[data-type="literal"]').should('contain', '135');
    cy.get('#viewUIResults span[data-type="literal"]').then((elem) => {
      expect(elem.attr('title')).to.equal('Literal number');
    });
  });

  it('gets value', function () {
    cy.clearTypeAndBlur('#getValueForString', '123.45');
    cy.get('@consoleLog').should('be.calledWith', 123.45);
  });

  // For the "Type choices with initial value set" control
  it.skip('gets a value set onload', function () {
    cy.get(
      'input[name="demo-type-choices-only-initial-value-literal"]'
    ).should(($input) => {
      expect($input.val()).to.equal('135');
    });
  });
});

describe.only('literal (string) spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('creates form control', () => {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal string)'
    );
    cy.get('textarea[name="demo-keypath-not-expected-string"]').should(
      'exist'
    );
  });

  it('gets type', function (done) {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');
    cy.on('window:alert', (t) => {
      expect(t).to.eq('literal');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal string)'
    );

    cy.get('button#getType').click();
  });

  it('is valid', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq(true);
      done();
    });
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal string)'
    );

    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal string)'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', 'abcde');
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 2');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Literal (Literal string)'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="literal"]').should('exist');
    cy.get('#viewUIResults span[data-type="literal"]').should(
      'contain', 'abcde'
    );
    cy.get('#viewUIResults span[data-type="literal"]').then((elem) => {
      expect(elem.attr('title')).to.equal('Literal string');
    });
  });

  it('gets value', function () {
    cy.clearTypeAndBlur('#getValueForString', '"abcde"');
    cy.get('@consoleLog').should('be.calledWith', 'abcde');
  });

  // For the "Type choices with initial value set" control
  it.skip('gets a value set onload', function () {
    cy.get(
      'input[name="demo-type-choices-only-initial-value-literal"]'
    ).should(($input) => {
      expect($input.val()).to.equal('abcde');
    });
  });
});

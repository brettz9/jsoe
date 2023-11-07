describe('string spec', () => {
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
      'string'
    );
    cy.get('textarea[name="demo-keypath-not-expected-string"]').should(
      'exist'
    );
  });

  it('gets type', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq('string');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'string'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'test123'
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
      'string'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'test123'
    );
    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'string'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'test123'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should('be.calledWith', 'test123');
  });

  it('views UI', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'string'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'test123'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="string"]').should('exist');
    cy.get('#viewUIResults span[data-type="string"]').should(
      'contain', 'test123'
    );
  });

  it('gets value', function () {
    cy.clearTypeAndBlur('#getValueForString', '"test123"');
    cy.get('@consoleLog').should('be.calledWith', 'test123');
  });

  // For the "Type choices with initial value set" control
  it('gets a value set onload', function () {
    cy.get(
      'textarea[name="demo-type-choices-only-initial-value-string"]'
    ).should(($textarea) => {
      expect($textarea.val()).to.equal('test123');
    });
  });
});

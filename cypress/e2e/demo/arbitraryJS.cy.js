/**
 * From https://stackoverflow.com/a/74065594/271577 .
 * @param {() => boolean} checkForProperty
 */
const waitForProperty = (
  checkForProperty
) => cy.wrap({}).then(() => new Cypress.Promise((resolve) => {
  // run this every 500ms until our condition is met or
  //   10 seconds has passed.
  let elapsed = 0;
  const checkIfResolvedYet = () => {
    elapsed += 500;
    if (checkForProperty()) {
      resolve();
      return;
    }

    // If it didn't resolve, check again in 500ms
    if (elapsed < 10000) {
      setTimeout(checkIfResolvedYet, 500);
    }
  };

  // Run initial check
  checkIfResolvedYet();
}));

describe('Arbitrary JavaScript spec', () => {
  let called = false;
  beforeEach(() => {
    called = false;
    cy.visit('http://127.0.0.1:8087/demo/index-arbitraryJS-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').callsFake((msg) => {
          if (typeof msg === 'symbol') {
            called = true;
            expect(
              String(msg)
            ).to.equal('Symbol(abc)');
          }
        });
      }
    });
  });

  it('creates form control', () => {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'symbol'
    );
    cy.get('input[name="demo-keypath-not-expected-symbol"]').should(
      'exist'
    );
  });

  it('gets type', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq('symbol');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'symbol'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-symbol"]',
      'abc'
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
      'symbol'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-symbol"]',
      'abc'
    );
    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'symbol'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-symbol"]',
      'abc'
    );

    cy.get('button#logValue').click();

    waitForProperty(() => {
      return called;
    });
  });

  it('logs value (Symbol.for)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'symbol'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-symbol"]',
      'abc'
    );
    cy.get(sel + 'input[value="Symbol.for"]').click();

    cy.get('button#logValue').click();

    waitForProperty(() => {
      return called;
    });
  });

  it('views UI', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'symbol'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-symbol"]',
      'abc'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="symbol"]').should('exist');
    cy.get('#viewUIResults span[data-type="symbol"]').should('contain', 'abc');
  });

  it('views UI (Symbol.for)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'symbol'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-symbol"]',
      'abc'
    );
    cy.get(sel + 'input[value="Symbol.for"]').click();

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="symbol"]').should('exist');
    cy.get(
      '#viewUIResults span[data-type="symbol"] b'
    ).should('contain', 'Global');
    cy.get('#viewUIResults span[data-type="symbol"]').should('contain', 'abc');
  });

  it('views UI (Symbol - schema)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + '.formatChoices').select(
      'schema'
    );
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Symbol (A symbol)'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-symbol"]',
      'abc'
    );
    cy.get(sel + 'input[value="Symbol"]').click();

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="symbol"]').should('exist');
    cy.get('#viewUIResults span[data-type="symbol"]').should('contain', 'abc');
  });

  it('gets value (Symbol)', function () {
    cy.clearTypeAndBlur('#getValueForString', 'Symbol(abc)');
    waitForProperty(() => {
      return called;
    });
  });

  it('gets value (Symbol.for)', function () {
    cy.clearTypeAndBlur('#getValueForString', 'Symbol.for(abc)');
    waitForProperty(() => {
      return called;
    });
  });

  // // For the "Type choices with initial value set" control
  // it('gets a value set onload', function () {
  //   cy.get(
  //     'input[name="demo-type-choices-only-initial-value-symbol"]'
  //   ).should(($input) => {
  //     expect($input.val()).to.equal('abc');
  //   });
  // });
});

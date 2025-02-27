describe('DOMRect spec', () => {
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
      'domrect'
    );
    cy.get('input[name="demo-keypath-not-expected-domrect-x"]').should(
      'exist'
    );
  });

  it('gets type', function (done) {
    cy.on('window:alert', (t) => {
      expect(t).to.eq('domrect');
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'domrect'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
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
      'domrect'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
    );

    cy.get('button#isValid').click();
  });

  it('logs value', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'domrect'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should(
      'be.calledWith', new DOMRect(123, 456)
    );
  });

  it('logs value (readonly)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'domrect'
    );

    cy.get('[name="demo-keypath-not-expected-domrect-readonly-3"]').check(
      'readonly'
    );

    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
    );

    cy.get('button#logValue').click();
    cy.get('@consoleLog').should(
      'be.calledWith', new DOMRectReadOnly(123, 456)
    );
  });

  it('views UI', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'domrect'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults div[data-type="domrect"]').should(
      'contain', 'DOMRect'
    );
    cy.get('#viewUIResults div[data-type="domrect"]').should(
      'contain', '123'
    );
    cy.get('#viewUIResults div[data-type="domrect"]').should(
      'contain', '456'
    );
  });

  it('views UI (readonly)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'domrect'
    );
    cy.get('[name="demo-keypath-not-expected-domrect-readonly-3"]').check(
      'readonly'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults div[data-type="domrect"]').should(
      'contain', 'DOMRectReadOnly'
    );
    cy.get('#viewUIResults div[data-type="domrect"]').should(
      'contain', '123'
    );
    cy.get('#viewUIResults div[data-type="domrect"]').should(
      'contain', '456'
    );
  });

  describe('getInput()', function () {
    it('Shows the DOMRect root form control', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('domrect');

      cy.get('#showRootFormControl').click();

      cy.get(
        '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
        'div[data-type="domrect"] input'
      ).should(($input) => {
        expect($input[0].style.backgroundColor).to.equal('red');
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needed
      cy.wait(3000);

      cy.get(
        '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
        'div[data-type="domrect"] input'
      ).should(($input) => {
        expect($input[0].style.backgroundColor).to.not.equal('red');
      });
    });
  });

  it('gets value', function () {
    cy.clearTypeAndBlur(
      '#getValueForString',
      'DOMRect({{}"x":123, "y": 456})'
    );
    cy.get('@consoleLog').should(
      'be.calledWith', new DOMRect(123, 456)
    );
  });

  it('gets value (readonly)', function () {
    cy.clearTypeAndBlur(
      '#getValueForString',
      'DOMRectReadOnly({{}"x":123, "y": 456})'
    );
    cy.get('@consoleLog').should(
      'be.calledWith', new DOMRectReadOnly(123, 456)
    );
  });

  // For the "Type choices with initial value set" control
  it('gets a value set onload', function () {
    cy.get(
      'input[name="demo-type-choices-only-initial-value-domrect-x"]'
    ).should(($input) => {
      expect($input.val()).to.equal('1');
    });
  });
});

describe('DOMRect spec (schemas)', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('views UI', function () {
    cy.get('.formatChoices:first').select('Schema: Zodex schema instance 2');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'domrect'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults div[data-type="domrect"]').then((elem) => {
      expect(elem.attr('title')).to.equal('(a `DOMRect`)');
    });
  });

  it('views UI (readonly)', function () {
    cy.get('.formatChoices:first').select('Schema: Zodex schema instance 2');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'domrect'
    );
    cy.get('[name="demo-keypath-not-expected-domrect-readonly-1"]').check(
      'readonly'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-x"]',
      '123'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-domrect-y"]',
      '456'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults div[data-type="domrect"]').then((elem) => {
      expect(elem.attr('title')).to.equal('(a `DOMRectReadOnly`)');
    });
  });
});

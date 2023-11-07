describe('Set spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('creates form control', () => {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select('set');
    cy.get(sel + '.addArrayElement').click();
    cy.get('.arrayItems .typeChoices-demo-keypath-not-expected').select('null');
    cy.get(sel + '.addArrayElement').click();
    cy.get(sel + '.arrayItems fieldset:nth-of-type(2) ' +
      '.typeChoices-demo-keypath-not-expected').select('true');
    cy.get('#viewUI').click();

    cy.get(
      sel + 'input[name="demo-keypath-not-expected-null"]'
    ).should('be.checked');
    cy.get(sel + 'input[name="demo-keypath-not-expected-true1"]').should(
      'be.checked'
    );
  });

  it('errs on duplicate set values', (done) => {
    cy.on('window:alert', (t) => {
      expect(t).to.eq(false);
      done();
    });
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select('set');
    cy.get(sel + '.addArrayElement').click();
    cy.get('.arrayItems .typeChoices-demo-keypath-not-expected').select('true');
    cy.get(sel + '.addArrayElement').click();

    cy.get(sel + '.arrayItems fieldset:nth-of-type(2) ' +
      '.typeChoices-demo-keypath-not-expected').select('true');

    cy.get(
      sel + 'input[name="demo-keypath-not-expected-true1"][value=true]'
    ).should(
      'be.checked'
    );

    cy.get(
      sel + 'input[name="demo-keypath-not-expected-true2"][value=true]'
    ).should(
      'be.checked'
    );

    // Why isn't this working?
    // // eslint-disable-next-line promise/catch-or-return -- Cypress
    // cy.get(
    //   sel + 'input[name="demo-keypath-not-expected-true2"][value=true]'
    // eslint-disable-next-line @stylistic/max-len -- Long
    // // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
    // ).then(($radio) => {
    //   expect(/** @type {HTMLInputElement} */ (
    //     $radio[0]
    //   ).validationMessage).to.eq(
    //     'Duplicate Set value'
    //   );
    // });

    cy.get('#isValid').click();
  });

  it('converts a string to a Set', function () {
    cy.typeAndBlur('#getValueForString', 'Set(3, "abc")');
    cy.get('@consoleLog').should('be.calledWith', new Set([3, 'abc']));
  });

  it('shows form control from root ancestor (for a set)', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('set');

    cy.get('#showFormControlFromRootAncestor').click();

    cy.get(
      '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
      'div[data-type="set"] > button'
    ).should(($button) => {
      expect($button[0].style.backgroundColor).to.equal('red');
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needed
    cy.wait(3000);

    cy.get(
      '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
      'div[data-type="set"] > button'
    ).should(($button) => {
      expect($button[0].style.backgroundColor).to.not.equal('red');
    });
  });
});

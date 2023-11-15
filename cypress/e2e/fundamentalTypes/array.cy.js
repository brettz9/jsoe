describe('Array spec', function () {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('creates sparse arrays', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'arrayNonindexKeys'
    );

    cy.get(sel + 'button.addArrayElement').click();
    cy.get('dialog[open] > .submit > button:nth-child(1)').click();
    cy.get(sel + 'input.propertyName-demo-keypath-not-expected').type('aaa');

    cy.get(
      sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(
      sel + '.arrayContents .arrayContents input[type="number"]', '4'
    );

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.clearAndType(
      sel +
        '.arrayItems .arrayItems input.propertyName-demo-keypath-not-expected',
      '1'
    );

    cy.get(
      sel +
        '.arrayItems .arrayItems select.typeChoices-demo-keypath-not-expected'
    ).select('true');
  });

  it('creates sparse array items with + button', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'arrayNonindexKeys'
    );

    cy.get(sel + 'button.addArrayElement').click();
    cy.get('dialog[open] > .submit > button:nth-child(1)').click();

    cy.clearAndType(
      sel + 'input.propertyName-demo-keypath-not-expected',
      'aaa'
    );

    cy.get(
      sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(
      sel + '.arrayContents .arrayContents input[type="number"]', '4'
    );

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    // Todo: Seems to be a bug with the `+` button when no item; adds
    //        to properties instead of array
    cy.get(
      sel + '.arrayContents div[data-type="arrayNonindexKeys"] ' +
      '.arrayItems > fieldset > button:nth-of-type(1)'
    ).contains('+').click();

    cy.get(
      sel + '.arrayContents div[data-type="arrayNonindexKeys"] ' +
      'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '0');

    cy.get(
      sel + '.arrayContents div[data-type="arrayNonindexKeys"] ' +
      'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '1');
  });

  it('resorts sparse array upon deletion', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'arrayNonindexKeys'
    );

    cy.get(sel + 'button.addArrayElement').click();
    cy.get('dialog[open] > .submit > button:nth-child(1)').click();

    cy.get(sel + 'input.propertyName-demo-keypath-not-expected').type('aaa');

    cy.get(
      sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(
      sel + '.arrayItems .arrayContents input[type="number"]', '4'
    );

    cy.get(
      sel + 'div[data-type="arrayNonindexKeys"] ' +
        '.arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel + 'div[data-type="arrayNonindexKeys"] ' +
        '.arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel + 'div[data-type="arrayNonindexKeys"] ' +
      'fieldset:nth-of-type(1) button:nth-of-type(2)'
    ).contains('x').click();

    cy.get(
      sel + '.arrayItems .arrayItems ' +
        'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '1');
  });

  it('resorts properties of sparse array upon property rename', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'arrayNonindexKeys'
    );

    cy.get(sel + 'button.addArrayElement').click();
    cy.get('dialog[open] > .submit > button:nth-child(1)').click();

    cy.get(sel + 'input.propertyName-demo-keypath-not-expected').type('aaa');

    cy.get(
      sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(
      sel + '.arrayContents .arrayContents input[type="number"]', '4'
    );

    cy.get(
      sel + 'div[data-type="arrayNonindexKeys"] ' +
        '.arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.typeAndBlur(
      sel +
      '.arrayItems .arrayItems fieldset:nth-of-type(1) ' +
        'input.propertyName-demo-keypath-not-expected',
      'zab'
    );

    cy.get(
      sel +
      '.arrayItems .arrayItems fieldset:nth-of-type(1) ' +
      'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '1');
  });

  it('shows invalid length if not extending array', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'arrayNonindexKeys'
    );

    cy.get(sel + 'button.addArrayElement').click();
    cy.get('dialog[open] > .submit > button:nth-child(1)').click();

    cy.get(
      sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
    ).select('number');

    cy.clearAndType(
      sel + 'input[name="demo-keypath-not-expected-number"]',
      '3'
    );

    cy.get(sel + 'button.addArrayElement').click();
    cy.get('dialog[open] > .submit > button:nth-child(1)').click();

    cy.get(
      sel + '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('number');

    cy.clearTypeAndBlur(
      sel +
        '.arrayItems > fieldset:nth-of-type(2) ' +
          'input.propertyName-demo-keypath-not-expected',
      '4'
    );

    cy.get(
      'dialog[open]:not(.addRecordDialog) .submit button:nth-of-type(2)'
    ).click();

    // eslint-disable-next-line promise/catch-or-return -- Cypress
    cy.get(
      'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
    // eslint-disable-next-line @stylistic/max-len -- Long
    // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
    ).then(($button) => {
      expect(/** @type {HTMLButtonElement} */ (
        $button[0]
      ).validationMessage).to.eq(
        'Invalid length'
      );
    });
  });

  it('ignores extra last item removal click', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'arrayNonindexKeys'
    );

    cy.get(sel + 'button.addArrayElement').click();
    cy.get('dialog[open] > .submit > button:nth-child(1)').click();

    cy.get('input.propertyName-demo-keypath-not-expected').type('aaa');
    cy.get(
      '.arrayItems select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');
    cy.clearTypeAndBlur(
      sel +
      '.arrayContents .arrayContents input[type="number"]', '4'
    );

    // Check removal of last item
    cy.get(
      'div[data-type="arrayNonindexKeys"] .arrayContents button:nth-of-type(2)'
    ).contains('- Last item').click();

    cy.get(
      '.arrayItems .arrayItems select.typeChoices-demo-keypath-not-expected'
    ).should('not.exist');
  });

  it('builds and manipulates a JSON array', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(sel + 'select.formatChoices').select('json');

    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'array'
    );

    cy.get(
      sel + 'div[data-type="array"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel + '.arrayItems ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    // Check removal of last item
    cy.get(
      sel + 'div[data-type="array"] .arrayContents button:nth-of-type(2)'
    ).contains('- Last item').click();
    cy.get(
      sel + '.arrayItems .arrayItems ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).should('not.exist');

    // Add multiple items (to check removal)
    cy.get(
      sel + 'div[data-type="array"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();
    cy.get(
      sel + 'div[data-type="array"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel + '.arrayItems ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).should('exist');

    // Check removal of all items
    cy.get(
      sel + 'div[data-type="array"] .arrayContents button:nth-of-type(3)'
    ).contains('x All').click();
    cy.get(
      sel + '.arrayItems ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).should('not.exist');

    cy.get(
      sel + 'div[data-type="array"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();
    cy.get(
      sel + 'div[data-type="array"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();
    cy.get(
      sel + 'div[data-type="array"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(1) select.typeChoices-demo-keypath-not-expected'
    ).select('null');
    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(2) select.typeChoices-demo-keypath-not-expected'
    ).select('true');
    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(3) select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(2) ' +
      '.arrayItem-arrowHolder-demo-keypath-not-expected > button:nth-of-type(1)'
    ).contains('↑').click();
    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(2) ' +
      '.arrayItem-arrowHolder-demo-keypath-not-expected > button:nth-of-type(2)'
    ).contains('↓').click();

    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(1) select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'true');
    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(2) select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'false');
    cy.get(
      sel + 'div[data-type="array"] ' +
      'fieldset:nth-of-type(3) select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'null');
  });

  it('truncates an array', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');
    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(1) select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(2) select.typeChoices-demo-keypath-not-expected'
    ).select('null');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(3) select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(4) select.typeChoices-demo-keypath-not-expected'
    ).select('undef');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '2');
    cy.get('dialog[open] .submit button').contains('Ok').click();

    cy.get(
      sel + '.arrayItems ' +
      'fieldset:nth-of-type(1) select.typeChoices-demo-keypath-not-expected'
    ).should('exist');
    cy.get(
      sel + '.arrayItems ' +
      'fieldset:nth-of-type(2) select.typeChoices-demo-keypath-not-expected'
    ).should('exist');
    cy.get(
      sel + '.arrayItems ' +
      'fieldset:nth-of-type(3) select.typeChoices-demo-keypath-not-expected'
    ).should('not.exist');
    cy.get(
      sel + '.arrayItems ' +
      'fieldset:nth-of-type(4) select.typeChoices-demo-keypath-not-expected'
    ).should('not.exist');
  });

  it('cancels truncatating an array', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');
    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(1) select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(2) select.typeChoices-demo-keypath-not-expected'
    ).select('null');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(3) select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(4) select.typeChoices-demo-keypath-not-expected'
    ).select('undef');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '2');

    cy.get(
      'dialog[open]:not(.addRecordDialog) .submit button:nth-of-type(2)'
    ).contains('Cancel').click();

    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(1) select.typeChoices-demo-keypath-not-expected'
    ).should('exist');
    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(2) select.typeChoices-demo-keypath-not-expected'
    ).should('exist');
    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(3) select.typeChoices-demo-keypath-not-expected'
    ).should('exist');
    cy.get(
      sel +
      '.arrayItems ' +
      'fieldset:nth-of-type(4) select.typeChoices-demo-keypath-not-expected'
    ).should('exist');
  });

  it('sorts by array index, but only numerical', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.clearAndType(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'input.propertyName-demo-keypath-not-expected',
      'abc'
    );

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    // New item 0 will be sorted as first item, so edit it instead of "abc" item
    cy.clearAndType(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'input.propertyName-demo-keypath-not-expected',
      '2'
    );

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    // Creates item 3 (auto-incrementing) but in position 2
    cy.clearTypeAndBlur(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'input.propertyName-demo-keypath-not-expected',
      '1'
    );

    // Rearranged now
    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '1');
    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '2');
    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(3) ' +
        'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'abc');
  });

  it('swaps mixed alphabetic/numeric indexed array values', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.clearTypeAndBlur(
      sel +
      'input.propertyName-demo-keypath-not-expected',
      'abc'
    );

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    // Inserted above existing, so use 1st again
    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] ' +
      'fieldset:nth-of-type(2) ' +
      '.arrayNonindexKeysItem-arrowHolder-demo-keypath-not-expected > ' +
        'button:nth-of-type(1)'
    ).contains('↑').click();

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'true');

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'false');

    cy.get(
      sel +
      'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '0');
    cy.get(
      sel +
      'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'abc');
  });

  it('swaps alphabetically indexed array values', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.clearTypeAndBlur(
      sel +
      'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected',
      'abc'
    );

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    // Inserted above existing, so use 1st again
    cy.clearTypeAndBlur(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'input.propertyName-demo-keypath-not-expected',
      'def'
    );

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] ' +
      'fieldset:nth-of-type(2) ' +
      '.arrayNonindexKeysItem-arrowHolder-demo-keypath-not-expected > ' +
      'button:nth-of-type(1)'
    ).contains('↑').click();

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'true');

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'false');

    cy.get(
      sel +
      'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'abc');
    cy.get(
      sel +
      'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'def');
  });

  it('swaps numerically indexed array values', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] ' +
      'fieldset:nth-of-type(2) ' +
      '.arrayNonindexKeysItem-arrowHolder-demo-keypath-not-expected > ' +
        'button:nth-of-type(1)'
    ).contains('↑').click();

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'false');

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'true');

    cy.get(
      sel +
      'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '0');
    cy.get(
      sel +
      'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '1');
  });

  it('appends empty item if working on alphabetic array index', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.clearTypeAndBlur(
      sel +
      'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected',
      'abc'
    );

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    cy.get(
      sel + 'div[data-type="arrayNonindexKeys"] ' +
      '.arrayItems > fieldset > button:nth-of-type(1)'
    ).contains('+').click();

    cy.clearTypeAndBlur(
      sel + '.arrayItems fieldset:nth-of-type(2) ' +
        'input.propertyName-demo-keypath-not-expected',
      'def'
    );

    cy.get(
      sel + '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel + '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'true');

    cy.get(
      sel + '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'false');

    cy.get(
      sel + 'fieldset:nth-of-type(1) ' +
        'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'abc');
    cy.get(
      sel + 'fieldset:nth-of-type(2) ' +
        'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'def');
  });

  it('decrements array index when non-numeric properties present', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.clearTypeAndBlur(
      sel +
      'input.propertyName-demo-keypath-not-expected',
      'abc'
    );

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('true');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    // Inserted above existing, so use 1st again
    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('false');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('null');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] ' +
      'fieldset:nth-of-type(1) button:nth-of-type(2)'
    ).contains('x').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).select('undef');

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(1) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'null');

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(2) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'undef');

    cy.get(
      sel +
      '.arrayItems fieldset:nth-of-type(3) ' +
        'select.typeChoices-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'true');

    cy.get(
      sel +
      'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '1');
    cy.get(
      sel +
      'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '2');
    cy.get(
      sel +
      'fieldset:nth-of-type(3) input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', 'abc');
  });

  it('resorts numeric up to nearest non-numeric', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.clearTypeAndBlur(
      sel + '.arrayItems fieldset:nth-of-type(3) ' +
        'input.propertyName-demo-keypath-not-expected',
      'xyz'
    );
    cy.clearTypeAndBlur(
      sel + '.arrayItems fieldset:nth-of-type(3) ' +
        'input.propertyName-demo-keypath-not-expected',
      'abc'
    );

    cy.clearTypeAndBlur(
      sel + '.arrayItems fieldset:nth-of-type(1) ' +
        'input.propertyName-demo-keypath-not-expected',
      '3'
    );

    cy.get(
      sel + '.arrayItems fieldset:nth-of-type(2) ' +
        'input.propertyName-demo-keypath-not-expected'
    ).invoke('val').should('eq', '3');
  });

  it('Removes all array items', function () {
    const sel = '#formatAndTypeChoices ';

    cy.get(
      sel + 'select.typeChoices-demo-keypath-not-expected'
    ).select('arrayNonindexKeys');

    cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button:nth-of-type(3)'
    ).contains('x All').click();

    cy.get(
      sel +
      'div[data-type="arrayNonindexKeys"] .arrayContents button.addArrayElement'
    ).contains('+ Item').click();

    cy.get(
      sel +
      '.arrayItems fieldset:last-child input'
    ).should(($input) => {
      expect($input.val()).to.equal('0');
    });
  });

  describe('getInput()', function () {
    it('Shows the array root form control', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('arrayNonindexKeys');

      cy.get('#showRootFormControl').click();

      cy.get(
        '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
        'div[data-type="arrayNonindexKeys"] > button'
      ).should(($button) => {
        expect($button[0].style.backgroundColor).to.equal('red');
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needed
      cy.wait(3000);

      cy.get(
        '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
        'div[data-type="arrayNonindexKeys"] > button'
      ).should(($button) => {
        expect($button[0].style.backgroundColor).to.not.equal('red');
      });
    });

    it('Shows the object root form control', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('object');

      cy.get('#showRootFormControl').click();

      cy.get(
        '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
        'div[data-type="object"] > button'
      ).should(($button) => {
        expect($button[0].style.backgroundColor).to.equal('red');
      });
    });
  });

  describe('getValue()', function () {
    it('Gets value of non-sparse array', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(sel + 'select.formatChoices').select('indexedDBKey');

      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'array'
      );

      cy.get(
        sel + 'div[data-type="array"] .arrayContents button.addArrayElement'
      ).contains('+ Item').click();

      cy.get(
        sel + '.arrayItems ' +
          'select.typeChoices-demo-keypath-not-expected'
      ).select('string');

      cy.typeAndBlur(
        'textarea[name="demo-keypath-not-expected-string"]',
        'abc'
      );

      cy.get('button#logValue').click();
      cy.get('@consoleLog').should('be.calledWith', ['abc']);
    });
  });

  describe('toValue()', function () {
    it('Converts string to simple array', function () {
      cy.typeAndBlur('#getValueForString', '[]');

      cy.get('@consoleLog').should('be.calledWith', []);
    });

    it('Converts string to array', function () {
      cy.typeAndBlur('#getValueForString', '["abc", [3], 45]');

      cy.get('@consoleLog').should('be.calledWith', ['abc', [3], 45]);
    });

    it('Converts string to nested array', function () {
      cy.typeAndBlur('#getValueForString', '[[]]');

      cy.get('@consoleLog').should('be.calledWith', [[]]);
    });

    it('Converts incomplete string to array', function () {
      cy.typeAndBlur('#getValueForString', '[');

      cy.get('@consoleLog').should('be.calledWith', []);
    });

    it('Converts incomplete string (sparse) to array', function () {
      cy.typeAndBlur('#getValueForString', '[,,');

      // eslint-disable-next-line no-sparse-arrays -- Testing
      cy.get('@consoleLog').should('be.calledWith', [,,]);
    });

    it('Converts string to sparse array', function () {
      cy.typeAndBlur('#getValueForString', '["abc", ,]');

      // eslint-disable-next-line no-sparse-arrays -- Testing
      cy.get('@consoleLog').should('be.calledWith', ['abc', ,]);
    });

    it('Converts string to array (indexedDBKey)', function () {
      cy.get('#useIndexedDBKey').click();
      cy.typeAndBlur('#getValueForString', '["abc", 45]');

      cy.get('@consoleLog').should('be.calledWith', ['abc', 45]);
    });

    it('Converts string to simple object', function () {
      cy.typeAndBlur('#getValueForString', '{}');

      cy.get('@consoleLog').should('be.calledWith', {});
    });

    it('Converts string to object', function () {
      // Note: this uses a special escape for the initial bracket
      cy.typeAndBlur('#getValueForString', '{{}a: 1, b: 2, "c": ""}');

      cy.get('@consoleLog').should('be.calledWith', {a: 1, b: 2, c: ''});
    });

    it('Converts incomplete string to object', function () {
      // Note: this uses a special escape for the initial bracket
      cy.typeAndBlur('#getValueForString', '{{}');

      cy.get('@consoleLog').should('be.calledWith', {});
    });

    it('Converts incomplete string to object', function () {
      // Note: this uses a special escape for the initial bracket
      cy.typeAndBlur('#getValueForString', '{{}');

      cy.get('@consoleLog').should('be.calledWith', {});
    });

    it('Converts incomplete string to object', function () {
      // Note: this uses a special escape for the initial bracket
      cy.typeAndBlur('#getValueForString', '{{}abc:');

      cy.get('@consoleLog').should('be.calledWith', {});
    });

    it('Converts string to object', function () {
      // Note: this uses a special escape for the initial bracket
      cy.typeAndBlur('#getValueForString', '{{}a:{{}}}');

      cy.get('@consoleLog').should('be.calledWith', {a: {}});
    });
  });

  describe('View UI', function () {
    it('Generates UI for array', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'arrayNonindexKeys'
      );

      cy.get('button#viewUI').click();
      cy.get(
        '#viewUIResults div[data-type="arrayNonindexKeys"]'
      ).should('exist');
    });

    it('Generates UI for array with children', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'arrayNonindexKeys'
      );

      cy.clearTypeAndBlur(sel + '.arrayContents input[type="number"]', '4');

      cy.get(
        sel +
        'div[data-type="arrayNonindexKeys"] .arrayContents ' +
          'button.addArrayElement'
      ).contains('+ Item').click();

      cy.get(
        sel +
        '.arrayItems ' +
        'fieldset:nth-of-type(1) select.typeChoices-demo-keypath-not-expected'
      ).select('true');

      cy.get(
        sel +
        'div[data-type="arrayNonindexKeys"] ' +
          '.arrayContents button.addArrayElement'
      ).contains('+ Item').click();

      cy.get(
        sel +
        '.arrayItems ' +
        'fieldset:nth-of-type(2) select.typeChoices-demo-keypath-not-expected'
      ).select('null');

      cy.get('button#viewUI').click();
      cy.get(
        '#viewUIResults div[data-type="arrayNonindexKeys"]'
      ).should('exist');

      cy.get(
        '#viewUIResults .arrayItems > fieldset:nth-of-type(1) i[data-type=true]'
      ).should('have.text', 'true');
      cy.get(
        '#viewUIResults .arrayItems > fieldset:nth-of-type(2) i[data-type=null]'
      ).should('have.text', 'null');
      cy.get(
        '#viewUIResults .arrayItems > fieldset:nth-of-type(3) ' +
          'i[data-type=undef]'
      ).should('have.text', 'undefined');
      cy.get(
        '#viewUIResults .arrayItems > fieldset:nth-of-type(4) ' +
          'i[data-type=undef]'
      ).should('have.text', 'undefined');

      // Hide array view contents
      cy.get(
        '#viewUIResults div[data-type=arrayNonindexKeys] > button'
      ).click();

      cy.get(
        '#viewUIResults .arrayItems > fieldset:nth-of-type(4) ' +
          'i[data-type=undef]'
      ).should('be.hidden');

      cy.get(
        '#viewUIResults div[data-type=arrayNonindexKeys] > button'
      ).click();

      cy.get(
        '#viewUIResults .arrayItems > fieldset:nth-of-type(4) ' +
          'i[data-type=undef]'
      ).should('not.be.hidden');
    });

    it('Generates UI for object', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'object'
      );

      cy.get(sel + 'button.addArrayElement').click();
      cy.get(sel + 'input.propertyName-demo-keypath-not-expected').type('aaa');
      cy.get(
        sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
      ).select('null');

      cy.get('button#viewUI').click();
      cy.get(
        '#viewUIResults div[data-type="object"]'
      ).should('exist');

      cy.get(
        '#viewUIResults .arrayItems > fieldset:nth-of-type(1) i[data-type=null]'
      ).should('have.text', 'null');
    });
  });

  describe('Objects', function () {
    it('builds and manipulates an object', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('object');

      cy.get(sel + 'button.addArrayElement').click();

      // Add and remove item
      cy.get(
        sel + '.arrayItems > fieldset > button:nth-of-type(1)'
      ).contains('+').click();

      cy.get(
        sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
      ).should('exist');

      cy.get(
        sel + '.arrayItems > fieldset:nth-of-type(2) > button:nth-of-type(2)'
      ).contains('x').click();
      cy.get(
        sel +
        '.arrayItems .arrayItems select.typeChoices-demo-keypath-not-expected'
      ).should('not.exist');
    });

    it('collapses an object', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('object');

      cy.get(sel + 'button.addArrayElement').click();
      cy.get(sel + 'input.propertyName-demo-keypath-not-expected').type('aaa');
      cy.get(
        sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
      ).select('null');

      cy.get(sel + 'div[data-type="object"] > button').contains('-').click();

      cy.get(
        sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
      ).should('be.hidden');

      cy.get(sel + 'div[data-type="object"] > button').contains('+').click();

      cy.get(
        sel + '.arrayItems select.typeChoices-demo-keypath-not-expected'
      ).should('not.be.hidden');
    });

    it('reports duplicate property names', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('object');

      cy.get(sel + 'button.addArrayElement').click();
      cy.get(sel + 'input.propertyName-demo-keypath-not-expected').type('aaa');

      cy.get(sel + 'button.addArrayElement').click();
      cy.typeAndBlur(
        sel +
        'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected',
        'aaa'
      );

      // eslint-disable-next-line promise/catch-or-return -- Cypress
      cy.get(
        sel +
        'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
      ).then(($button) => {
        expect(/** @type {HTMLButtonElement} */ (
          $button[0]
        ).validationMessage).to.eq(
          'Duplicate property name'
        );
      });
    });

    it('reports only duplicate property names', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('object');

      cy.get(sel + 'button.addArrayElement').click();
      cy.get(sel + 'input.propertyName-demo-keypath-not-expected').type('aaa');

      cy.get(sel + 'button.addArrayElement').click();
      cy.typeAndBlur(
        sel +
        'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected',
        'bbb'
      );

      cy.get(sel + 'button.addArrayElement').click();
      cy.typeAndBlur(
        sel +
        'fieldset:nth-of-type(3) input.propertyName-demo-keypath-not-expected',
        'aaa'
      );

      // eslint-disable-next-line promise/catch-or-return -- Cypress
      cy.get(
        sel +
        'fieldset:nth-of-type(1) input.propertyName-demo-keypath-not-expected'
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
      ).then(($input) => {
        expect(/** @type {HTMLInputElement} */ (
          $input[0]
        ).validity.valid).to.eq(
          false
        );
      });

      // eslint-disable-next-line promise/catch-or-return -- Cypress
      cy.get(
        sel +
        'fieldset:nth-of-type(2) input.propertyName-demo-keypath-not-expected'
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
      ).then(($input) => {
        expect(/** @type {HTMLInputElement} */ (
          $input[0]
        ).validity.valid).to.eq(
          true
        );
      });

      // eslint-disable-next-line promise/catch-or-return -- Cypress
      cy.get(
        sel +
        'fieldset:nth-of-type(3) input.propertyName-demo-keypath-not-expected'
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
      ).then(($input) => {
        expect(/** @type {HTMLInputElement} */ (
          $input[0]
        ).validity.valid).to.eq(
          false
        );
      });
    });
  });
});

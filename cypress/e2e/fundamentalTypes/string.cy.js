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

describe('String spec (schemas)', () => {
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
      'String (A string)'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'hello'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="string"]').should('exist');
    cy.get('#viewUIResults span[data-type="string"]').should(
      'contain', 'hello'
    );
    cy.get('#viewUIResults span[data-type="string"]').then((elem) => {
      expect(elem.attr('title')).to.equal('A string');
    });
  });
});

describe('String date spec (schemas)', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 3');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-string"]',
      '1999-01-01'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="string"]').should('exist');
    cy.get('#viewUIResults span[data-type="string"]').should(
      'contain', '1999-01-01'
    );
    cy.get('#viewUIResults span[data-type="string"]').then((elem) => {
      expect(elem.attr('title')).to.equal('(a date string)');
    });
  });
});

describe('String email spec (schemas)', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 4');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-string"]',
      'brettz9@yahoo.com'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="string"]').should('exist');
    cy.get('#viewUIResults span[data-type="string"]').should(
      'contain', 'brettz9@yahoo.com'
    );
    cy.get('#viewUIResults span[data-type="string"]').then((elem) => {
      expect(elem.attr('title')).to.equal('(an email string)');
    });
  });
});

describe('String URL spec (schemas)', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('views UI', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 5');

    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String'
    );
    cy.clearTypeAndBlur(
      'input[name="demo-keypath-not-expected-string"]',
      'https://bahai.org'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults span[data-type="string"]').should('exist');
    cy.get('#viewUIResults span[data-type="string"]').should(
      'contain', 'https://bahai.org'
    );
    cy.get('#viewUIResults span[data-type="string"]').then((elem) => {
      expect(elem.attr('title')).to.equal('(a url string)');
    });
  });
});

describe('String spec - Misc. (schemas)', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('creates form control (with `defaultValue`)', () => {
    cy.get('.formatChoices').select('Schema: Zodex schema instance 6');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'string'
    );
    cy.get('textarea[name="demo-keypath-not-expected-string"]').should(
      'have.value', 'something to default'
    );
  });

  it('sets mins and maxes', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance mins and maxes'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'string'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abc'
    ).then((elem) => {
      // todo[cypress@>=14]: See if this is fixed: https://github.com/cypress-io/cypress/issues/1930
      // expect(elem[0].validity.tooShort).to.equal(true);
      expect(elem[0].validity.tooLong).to.equal(false);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdefghijklmnop'
    ).then((elem) => {
      expect(elem[0].validity.tooShort).to.equal(false);
      // todo[cypress@>=14]: See if this is fixed: https://github.com/cypress-io/cypress/issues/1930
      // expect(elem[0].validity.tooLong).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdefg'
    ).then((elem) => {
      expect(elem[0].validity.tooShort).to.equal(false);
      expect(elem[0].validity.tooLong).to.equal(false);
    });
  });

  it('sets mins and maxes (length)', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance mins and maxes 2'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'string'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abc'
    ).then((elem) => {
      // todo[cypress@>=14]: See if this is fixed: https://github.com/cypress-io/cypress/issues/1930
      // expect(elem[0].validity.tooShort).to.equal(true);
      expect(elem[0].validity.tooLong).to.equal(false);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdefghijklmnop'
    ).then((elem) => {
      expect(elem[0].validity.tooShort).to.equal(false);
      // todo[cypress@>=14]: See if this is fixed: https://github.com/cypress-io/cypress/issues/1930
      // expect(elem[0].validity.tooLong).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdefghij'
    ).then((elem) => {
      expect(elem[0].validity.tooShort).to.equal(false);
      expect(elem[0].validity.tooLong).to.equal(false);
    });
  });

  it('checks startsWith/endsWith and applies transforms', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance mins and maxes 3'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'string'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '   ABC XYZ   '
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abc but not the rest'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        "Value doesn't end with expected: xyz"
      );
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'no beginning but ends with xyz'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        "Value doesn't start with expected: abc"
      );
    });
  });

  it('checks includes and applies transforms', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 1'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdefghijkl'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'GHI'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value doesn't include the expected: GHI after position: 5`
      );
    });
  });

  it('checks includes and regex', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 2'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'axcGHI'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'axc'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value doesn't include the expected: GHI`
      );
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'GHI'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value doesn't match regular expression: a[a-z]c`
      );
    });
  });

  it('checks regex and flags', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 3'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'aXc'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'a3c'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value doesn't match regular expression: a[a-z]c with flags: i`
      );
    });
  });

  it('checks time and precision', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 4'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '01:05:17.789'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '01:05:17'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match time/precision.`
      );
    });
  });

  it('checks time', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 5'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '01:05:17.789'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '01:05:17'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcd'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match time/precision.`
      );
    });
  });

  it('checks datetime', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 6'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '1999-01-01T01:05:17.789Z'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '1999-01-01T01:05:17.789+05:00'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcd'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match datetime/precision/offset/local`
      );
    });
  });

  it('checks ip v4', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 7'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '127.0.0.1'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abc:def:ghi'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value doesn't match IP v4 pattern.`
      );
    });
  });

  it('checks ip v6', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 8'
    );
    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '2001:db8:3333:4444:5555:6666:7777:8888'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdefghi'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value doesn't match IP v6 pattern.`
      );
    });
  });

  it('checks emoji', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (Emoji)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '😊'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'a'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match emoji pattern`
      );
    });
  });

  it('checks uuid', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (UUID)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'e2a32899-c131-4348-91e8-45cc47783718'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdef'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match uuid pattern`
      );
    });
  });

  it('checks nanoid', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (Nanoid)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'V1StGXR8_Z5jdHi6B-myT'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdef'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match nanoid pattern`
      );
    });
  });

  it('checks cuid', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (CUID)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'cjld2cjxh0000qzrmn831i7rn'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdef'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match cuid pattern`
      );
    });
  });

  it('checks cuid2', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (CUID2)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'tz4a98xxat96iws9zmbrgj3a'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '---'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match cuid2 pattern`
      );
    });
  });

  it('checks ulid', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (ULID)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      '01ARZ3NDEKTSV4RRFFQ69G5FAV'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdef'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match ulid pattern`
      );
    });
  });

  it('checks duration', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (Duration)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'P3Y6M4DT12H30M5S'
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdef'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match duration pattern`
      );
    });
  });

  it('checks base64', () => {
    cy.get('.formatChoices').select(
      'Schema: Zodex schema instance strings 9'
    );
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'String (Base64)'
    );

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'aGVsbG8='
    ).then((elem) => {
      expect(elem[0].checkValidity()).to.equal(true);
    });

    cy.clearTypeAndBlur(
      'textarea[name="demo-keypath-not-expected-string"]',
      'abcdef'
    ).then((elem) => {
      expect(elem[0].validationMessage).to.equal(
        `Value does not match base64 pattern`
      );
    });
  });
});

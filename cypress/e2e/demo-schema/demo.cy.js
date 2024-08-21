import {getTypesForSchema} from '../../../src/index.js';

describe('Demo spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-schema-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('Opens schema object boolean option', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Object (Boolean)'
    );
    cy.get('#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'boolean');
  });

  it('Opens schema boolean option', function () {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );
    cy.get('#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'true');
  });

  it('Opens any schema (boolean) option', function () {
    cy.get('.formatChoices').select('Schema: any schema');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );
    cy.get('#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'true');
  });

  it('Opens any schema (never) option', function () {
    cy.get('.formatChoices').select('Schema: any schema');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'Never'
    );

    Cypress.on('uncaught:exception', (/* err, runnable */) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });

    cy.get('#viewUI').click();

    cy.get('#viewUIResults').should(
      'not.contain', 'Never (no value present here)'
    );
  });

  it('Opens unknown schema (boolean) option', function () {
    cy.get('.formatChoices').select('Schema: unknown schema');
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'boolean'
    );
    cy.get('#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'true');
  });

  it('Initializes a form control with a value', () => {
    cy.get('.formatChoices').select('Schema: Zodex schema instance');
    cy.get('#initializeWithValue').click();
    cy.get('#formatAndTypeChoices input[type=number]').should(($input) => {
      expect($input.val()).to.equal('42');
    });
  });
});

describe('`getTypesForSchema`', function () {
  it('errs with duplicate properties', function () {
    const schema = /** @type {import('zodex').SzIntersection} */ ({
      type: 'intersection',
      left: {
        type: 'object',
        properties: {},
        unknownKeys: 'passthrough'
      },
      right: {
        type: 'object',
        properties: {},
        unknownKeys: 'strict'
      }
    });

    expect(
      () => getTypesForSchema(schema, schema)
    ).to.throw();
  });

  it('copies properties from right', function () {
    const schema = /** @type {import('zodex').SzIntersection} */ ({
      type: 'intersection',
      left: {
        type: 'object',
        properties: {}
      },
      right: {
        type: 'object',
        properties: {},
        unknownKeys: 'strict'
      }
    });

    expect([...getTypesForSchema(schema, schema)]).to.deep.equal([{
      type: 'object',
      properties: {},
      unknownKeys: 'strict'
    }]);
  });
});

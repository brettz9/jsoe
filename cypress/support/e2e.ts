/// <reference types="cypress" />
// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands.js';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import '@cypress/code-coverage/support.js';

/**
 * ACCESSIBILITY.
 * @see https://www.npmjs.com/package/cypress-axe
 */
import 'cypress-axe';

Cypress.on('uncaught:exception', (err /* , runnable */) => {
  // We can't catch application errors within our tests, so let this go.
  if (
    err?.message.includes('Not yet instantiated') ||
    err?.message.includes('Bad error type')
  ) {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  }
  return undefined;
});

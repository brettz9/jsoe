describe('Root (Login) - Accessibility', function () {
  // https://www.npmjs.com/package/cypress-axe
  it('Root has no detectable a11y violations on load', () => {
    cy.visitURLAndCheckAccessibility('http://127.0.0.1:8087/demo/index-instrumented.html');
  });
});

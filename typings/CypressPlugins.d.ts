declare namespace Cypress {
  interface Chainable {
    clearAndType(sel: string, content: string): Chainable
    clickAndType(sel: string, content: string): Chainable
    typeAndBlur(sel: string, content: string): Chainable
    clearTypeAndBlur(sel: string, content: string): Chainable
    checkAccessibility(): void
    visitURLAndCheckAccessibility(url: string, CypressVisitOptions?: object): void
  }
}

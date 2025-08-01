/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      uiLogin(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("uiLogin", () => {
  cy.visit("/");
  cy.get("input[placeholder='Username']").type(Cypress.env("username"));
  cy.get("input[placeholder='Password']").type(Cypress.env("password"));
  cy.get("button[type='submit']").click();
});

export {};

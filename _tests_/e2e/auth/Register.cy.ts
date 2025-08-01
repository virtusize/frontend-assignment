describe("Register Flow", () => {
  beforeEach(() => {
    cy.visit("/?mode=register");
  });

  it("registers a new user successfully with a random username", () => {
    const randomUsername = `user_${Date.now()}`;

    cy.get('input[placeholder="Username"]').type(randomUsername);
    cy.get('input[placeholder="Password"]').type("securepass");
    cy.get('input[placeholder="Confirm Password"]').type("securepass");

    cy.get("form#register-form").submit();

    cy.url().should("not.include", "mode=register");
  });

  it("shows error when username already exists", () => {
    const existingUsername = Cypress.env("username");

    cy.get('input[placeholder="Username"]').type(existingUsername);
    cy.get('input[placeholder="Password"]').type("securepass");
    cy.get('input[placeholder="Confirm Password"]').type("securepass");

    cy.get("form#register-form").submit();

    cy.on("window:alert", (text) => {
      expect(text).toMatch(/username already taken/i);
    });
  });

  it("shows error for mismatched passwords", () => {
    cy.get('input[placeholder="Username"]').type("testuser123");
    cy.get('input[placeholder="Password"]').type("securepass");
    cy.get('input[placeholder="Confirm Password"]').type("wrongpass");

    cy.get("form#register-form").submit();

    cy.contains(/passwords do not match/i).should("exist");
  });

  it("shows error for short password", () => {
    cy.get('input[placeholder="Username"]').type("testuser123");
    cy.get('input[placeholder="Password"]').type("123");
    cy.get('input[placeholder="Confirm Password"]').type("123");

    cy.get("form#register-form").submit();

    cy.contains(/password must be at least/i).should("exist");
  });

  it("shows validation error for empty fields", () => {
    cy.get("form#register-form").submit();

    cy.contains(/username is required/i).should("exist");
    cy.contains(/password is required/i).should("exist");
  });

  it("navigates back to login form", () => {
    cy.contains(/back to login/i).click();

    cy.url().should("include", "mode=login");
    cy.get("form#login-form").should("exist");
  });
});

describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("logs in successfully with valid credentials", () => {
    const username = Cypress.env("username");
    const password = Cypress.env("password");
    console.log({ username, password });
    cy.get("input[placeholder='Username']").type(username);
    cy.get("input[placeholder='Password']").type(password);

    cy.contains("Login").click();

    cy.url().should("include", "/dashboard");
  });
  it("shows error on invalid credentials", () => {
    cy.visit("/");

    cy.get("input[placeholder='Username']").type("wronguser");
    cy.get("input[placeholder='Password']").type("wrongpass");

    cy.contains("Login").click();

    cy.contains(/invalid username or password/i).should("be.visible");

    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
  it("shows required field errors", () => {
    cy.contains("Login").click();

    cy.contains(/username is required/i).should("be.visible");
    cy.contains(/password is required/i).should("be.visible");
  });
  it("shows validation error for short password", () => {
    cy.get("input[placeholder='Username']").type("testuser");
    cy.get("input[placeholder='Password']").type("123");

    cy.contains("Login").click();

    cy.contains(/password must be at least/i).should("be.visible");
  });
  it("navigates to forgot password", () => {
    cy.contains("Forgot Password?").click();

    cy.url().should("include", "/?mode=forgot");
    cy.get("form#forgot-form").should("exist");
  });

  it("navigates to register", () => {
    cy.contains("Register").click();

    cy.url().should("include", "/?mode=register");
    cy.get("form#register-form").should("exist");
  });
});

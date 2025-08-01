describe("HomePage", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("shows login form on load", () => {
    cy.get("form#login-form").should("exist");
    cy.get("input[placeholder='Username']").should("exist");
    cy.get("input[placeholder='Password']").should("exist");
    cy.contains("Login").should("exist");
  });

  it("switches to register form", () => {
    cy.contains(/register/i).click();

    cy.get("form#register-form").should("exist");
    cy.get("input[placeholder='Confirm Password']").should("exist");
    cy.contains("Register").should("exist");
  });

  it("switches to forgot password form", () => {
    cy.contains(/forgot password/i).click();

    cy.get("form#forgot-form").should("exist");
    cy.get("input[placeholder='Enter your username']").should("exist");
    cy.contains("Reset Password").should("exist");
  });
});

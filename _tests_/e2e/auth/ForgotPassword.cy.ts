describe("Forgot Password Flow", () => {
  beforeEach(() => {
    cy.visit("/?mode=forgot");
  });

  it("shows validation error when username is empty", () => {
    cy.get('button[type="submit"]').click();
    cy.contains(/username is required/i).should("exist");
  });

  it("shows error for non-existent user", () => {
    cy.get('input[placeholder="Enter your username"]').type("nonexistentuser");
    cy.get('button[type="submit"]').click();

    cy.contains("User not found.").should("exist");
  });

  it("opens password modal when user exists", () => {
    cy.get('input[placeholder="Enter your username"]').type("testuser");
    cy.get('button[type="submit"]').click();

    cy.contains("Enter New Password").should("exist");
  });

  it("submits new password and closes modal", () => {
    cy.get('input[placeholder="Enter your username"]').type("testuser");
    cy.get('button[type="submit"]').click();

    cy.get('input[placeholder="New password"]').type("newpass123");
    cy.get('button[type="submit"]').contains("Submit").click();

    cy.contains("Password updated successfully").should("exist");
    cy.contains("Enter New Password").should("not.exist");
  });

  it("cancels password reset modal", () => {
    cy.get('input[placeholder="Enter your username"]').type("testuser");
    cy.get('button[type="submit"]').click();

    cy.contains("Enter New Password").should("exist");
    cy.get("button").contains("Cancel").click();
    cy.contains("Enter New Password").should("not.exist");
  });
  it("navigates back to login form", () => {
    cy.contains(/back to login/i).click();

    cy.url().should("include", "mode=login");
    cy.get("form#login-form").should("exist");
  });
});

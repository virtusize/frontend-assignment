describe("Dashboard Page Full Flow", () => {
  beforeEach(() => {
    cy.uiLogin();
  });

  it("can add, view, edit, search, and delete a client", () => {
    const uniqueName = `John Test ${Date.now()}`;

    cy.get("button").contains("+ Add Client").click();
    cy.get("input[name='name']").type(uniqueName);
    cy.get("input[name='company']").type("Test Co");
    cy.get("input[name='age']").type("35");
    cy.get("select[name='gender']").select("male");
    cy.get("select[name='currency']").select("USD");
    cy.get("input[name='subscriptionCost']").type("99.99");
    cy.get("button[type='submit']").click();
    cy.contains("Client added successfully").should("exist");

    cy.contains("[data-cy='client-table'] tr", uniqueName).within(() => {
      cy.get("[data-cy='view-btn']").click();
    });
    cy.get("[data-cy='client-view']").should("be.visible");
    cy.contains("Client Profile").should("exist");
    cy.get("button").contains("×").click();

    cy.contains("[data-cy='client-table'] tr", uniqueName).within(() => {
      cy.get("[data-cy='edit-btn']").click();
    });
    cy.get("input[name='company']").clear().type("Updated Co");
    cy.get("button[type='submit']").click();
    cy.contains("Client updated successfully").should("exist");

    cy.wait(3000); // - wait for toast
    cy.get("[data-cy='search-input']").clear().type(uniqueName);
    cy.contains("[data-cy='client-table'] tr", uniqueName).should("exist");

    cy.contains("[data-cy='client-table'] tr", uniqueName).within(() => {
      cy.get("[data-cy='delete-btn']").click();
    });

    cy.contains("Are you sure you want to delete this client?").should("exist");
    cy.get("button").contains("Delete").click();
    cy.wait(3000); // - wait for toast
    cy.contains("Client deleted").should("exist");

    cy.get("[data-cy='search-input']").clear().type(uniqueName);
    cy.contains("[data-cy='client-table'] tr", uniqueName).should("not.exist");
    cy.get("[data-cy='search-input']").clear();
  });
  it("can logout and go back to home page", () => {
    cy.get("[data-cy='logout-btn']").click();

    cy.url().should("include", "login");
    cy.contains("Login").should("exist");
  });
});

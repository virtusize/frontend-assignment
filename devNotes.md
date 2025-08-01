## ✅ Run the app

- Use `npm run dev` to start the app in development mode.
- Use `npm run build` to create a production build.
- Use `npm run preview` to preview the production build locally.
- Use `npm run api` to run the JSON server.

### ✅ Unit Tests (Jest)

- Zod Schemas: Validations, required fields, type coercions
- Modal components: Rendering, image fallback, API fallback
- Zustand logic: tested in isolation
- Pages: Rendering

### ✅ E2E Tests (Cypress)

- Custom command: `cy.uiLogin()` to simulate login
- Auth test:
  1. Login
  2. Register
  3. ForgotPassword - Can be improved with email verification if there is an actual server.
  - Cypress specs: `_tests_/e2e/auth/`
- Full client flow test:

  1. Add client
  2. View client
  3. Edit client
  4. Search client
  5. Delete client

- Cypress spec: `_tests_/e2e/Dashboard.cy.ts`

---

## 📌 Additional Notes

1. 🧪 All test files are organized under the `_tests_/` directory.
2. 🚀 To run E2E tests with the Cypress GUI, use: `npm run test:e2e-open`  
   To run all E2E tests in headless mode, use: `npm run test:e2e-run`
3. 🧪 To run unit tests, use: `npm run test:unit`  
   To run unit tests in watch mode, use: `npm run test:watch`

---

## 🔧 Potential Improvements

- 🔐 Implement real user roles and tie clients to user accounts
- 🖼️ Use file uploads instead of base64 for production
- 🌍 Add pagination on the backend (currently handled client-side)
- 📤 Allow export of client data (CSV, PDF)

---

# Developer Notes

**Login Credentials:**  
For demonstration purposes, authentication uses a static email and password:  
- **Email:** `user@example.com`  
- **Password:** `password123`  

## Tech Stack
- **Framework:** Vue 3 + Vite  
- **Styling:** SCSS with variables in `_variables.scss`  
- **Routing:** Vue Router  
- **State Management:** Local component state  
- **API Layer:** `apiService.ts` for data fetching abstraction  
- **Icons:** Installed **FontAwesome** package for icons such as close, save, logout, create new record, actions, and pagination buttons.  

## Flow Overview

### 1. SignIn Page
- Simulated authentication using `localStorage` flag (`isAuthenticated`).  
- **Validation:** Ensures both email and password fields are non-empty.  
- If either email or password is invalid, a **pop-up modal** appears saying *"Email or password is incorrect"*.
- On successful login:
  - A `loggedIn` key with a value of `true` is stored in **localStorage**.
  - User is redirected to **Dashboard**.
- **Auto Logout:** After 15 minutes of inactivity, the user is automatically logged out, redirected back to Sign In, and must log in again.

### 2. Dashboard
- Fetches initial client data from static `clients.json` via `apiService.ts`.
- Displays data using the **`TableList`** component.
- **Table Columns:**
  - **Actions** (dropdown with View, Edit, Delete)
  - **Name**
  - **Company**
  - **Subscription Cost** (with currency displayed beside the value)
  - **Age**
- **Pagination:**
  - Implemented with `<`, `<<`, numbered pages (`1`, `2`, ...), `>>`, and `>` buttons.
  - **Per page limit:** 10 records.
  - If there are more than 10 records, remaining records are shown on additional pages.
  - Blue pagination buttons indicate they are clickable.
  - **Record Ordering:** Newly created records are inserted **at the top** of the list (most recent first), so they are visible immediately on the first page.  
    - This ordering is handled by sorting records in descending order based on `id`.
- **Buttons:**
  - **Logout:** Logs the user out and redirects to Sign In.
  - **+ Create new record:** Opens `ModalForm` for adding new records.
- **Actions Column Details:**
  - Implemented as a dropdown with **View**, **Edit**, and **Delete** options:
    - **View:** Reuses the same modal structure to display:
      - Profile picture
      - Name
      - Company
      - Subscription cost
      - Currency
      - Age (hidden if not provided)
      - Gender (hidden if not provided)
      - Date registered (formatted as `"May 12, 2004"`)
      - Modal can be closed.
    - **Edit:** Reuses the create record modal but runs edit logic to update the existing record instead.
    - **Delete:** Shows a confirmation modal asking the admin to confirm deletion and explicitly stating the client’s name to prevent accidental deletions.

### 3. ModalForm
- Reusable modal for creation of new client records.
- Emits submitted data to parent (`Dashboard.vue`) for table update.
- **Validation Rules:**
  - Required: **name, company, subscription cost, currency**.
  - An asterisk (`*`) is displayed beside required fields.
  - **Subscription cost** and **age** must be **≥ 0**.
  - **Currency:** Uses a dropdown list populated via the `currency-codes` package. User can type to auto-search and set the currency for quick navigation and reduced errors.
  - **Optional fields:** Age and Gender (Gender uses an enum — `0` for male, `1` for female).
  - **Save button** is disabled unless all required fields are filled.
- **User Actions in Modal:**
  - Save record (if valid).
  - Cancel creation.
  - Close modal.

## Validation Rules Summary
- **SignIn.vue:**
  - Required: email, password.
  - Invalid email/password → pop-up modal error message.
- **ModalForm.vue:**
  - Required: name, company, subscription cost, currency.
  - Optional: age, gender.
  - No negative values for subscription cost or age.
  - Currency selection via searchable dropdown (currency-codes package).
  - Save disabled unless required fields are complete.

## File Responsibilities
- **`main.ts`**: Application entry, mounts Vue instance, registers router & styles.  
- **`router.ts`**: Defines routes (`/signin`, `/dashboard`) with guards.  
- **`apiService.ts`**: Encapsulates API calls to fetch data.  
- **`record.ts`**: TypeScript interfaces/types for records.  
- **`SignIn.vue`**: Login form & authentication logic.  
- **`Dashboard.vue`**: Main authenticated page, data fetching & management.  
- **`TableList.vue`**: Generic table rendering component with dropdown actions, delete confirmation modal, and pagination with **latest-first sorting**.  
- **`ModalForm.vue`**: Modal popup for record creation with validation.  
- **`main.scss`**: Global styles.  
- **`_variables.scss`**: Style variables for theme consistency.  

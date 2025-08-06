# Developer Notes

## Project structure
- Built using Vue 3 Setup Composition API, Vite, TypeScript, Tailwind 4, Nuxt UI Component Library, Unplugin Icons
- State management and data fetching built using Pinia, VueUse [useFetch](https://vueuse.org/core/usefetch/#usefetch)
- Implemented guardrails to ensure consistent codestyle using recommended ESLint, Tailwind, Stylistic formatting

## Design Strategies
- API responses are cached by page, only fetching for the specific page when the cache misses. 
- API Calls are handled using `handleResponse()` util to unify toast messages and expected response behaviors
- Modals are dynamically created and rendered using the `showModal()` util, allowing for compatibility with future created modal components + generic typings for robust logic application with inferred props and emits.
- Folder structure closely follows conventional industry standard structure, with `@` alias for root dir, disallowing confusing relative import paths with ESLint rules

## Admin Requirements

- **Login**: Authentication built via Auth0 Vue SDK + Vue Router Navigation Guards for easier DX, integration, and guaranteed security.

- **Client Information**: `<ClientTable>` component is built using Nuxt UI `<UTable>` component (using Reka UI/Radix Vue), to ensure extensibility, accessibility, and mobile-responsiveness.

- **Adding new clients**: Adding and updating clients are done using the generic `showModal()` util with the `<ClientModal>` component, with robust form validation using Zod schema.

- **Update current design**: Pagination is done with the help of a pagination store, client data store, + Nuxt UI `<UPagination>` component

- **Removing Client data**: Easily remove clients by using the generic `showModal()` util with the `<ConfirmationModal>` component instead

- **View all client details**: Client info is displayed with the reusable `<ClientModal>` component. Currency and date are formatted to respect the client computer's current locale region and time zone.

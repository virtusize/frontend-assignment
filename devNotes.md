## Running the Website

1. **The sole reason for containerizing the application** is to simplify setup and ensure consistency across different environments or machine. I use the latest node and vue version on my end hence it might not work for other devs using different version since there are also a lot of breaking changes I encountered juggling through different versions of node and vue if I didn't containerized the website
   Ensure you have **Docker** installed on your local machine.
2. Ensure you have **docker-compose** installed.
3. In the terminal, run:
   ```bash
   docker-compose up
   ```
4. This will set up everything, running both the `json-server` and the website.
5. Visit [http://localhost:9000](http://localhost:9000) to access the site.
6. Access the `json-server` endpoints at:
   - [http://localhost:9000/clients](http://localhost:9000/clients)
   - [http://localhost:9000/users](http://localhost:9000/users)

### Notes

- Check the `clients.json` file for email and password references. A `users` key has been added to simulate a login process.
- Passwords in the `clients.json` `users` key are **not encrypted** since this is only a backend simulation.
- For improved security, using `uuid` instead of integer strings for IDs is recommended (to prevent users from accessing other records by guessing IDs).
- Theming is not included, as this is an assignment and already sufficiently engineered for hiring purposes.
- The implementation is simple but covers most requirements, including a simulated login process. `/users` was added to `clients.json` for this purpose (the file could have been renamed to `api.json`, but `clients.json` was retained for clarity).
- State management (store) is not used, as it was not required for the assignment and the functionality can be achieved without it.

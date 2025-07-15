# Client Management System

## Core steps

1. Clone the repo
2. Check the requirements list
3. Once all the tasks are completed, please create a PR
4. Inform the Virtusize team about the PR

## Task Description

The CMS tool is a client management system that allows the Admin to easily create, manage, and remove new clients/users.

For fast prototyping we are using `json-server` use `npm run api` to start the server.
JSON-Server [documentation](https://github.com/typicode/json-server)

We expect the assignment to be completed within 4 to 5 hours.
If its taking more time than expected, do let us know in the `devNotes.md`

## Before you start

Read through the task list and work on each task in the given sequence.

Update the `devNotes.md` file where required, this is meant for leaving comments for the reviewers.

## Admin/Design Requirements

- **Login**: Before the user can access the data, they need to login into the application for security.

- **Client Information**: The CMS tool provides a flexible and hierarchical structure for organizing client data. The admin team has requested that the data should be displayed as a table.The table should display only the clients `name, company, subscriptionCost+currecy, age`.

- **Adding new clients**: The Client Management tool supports customizable workflows, allowing the admin to add new clients and update any of the client properties other than `registered` date.

- **Update current design**: The design team feels that the number of clients can get huge and has requested to only display 10 clients at a time.

- **Removing Client data**: The admin wants the ability to remove clients once the contract is over or ther are any delayed payments.

- **View all client details**: The admin team has requested to be to see all the data for a given client when selected. As some of the admin team members are currently working remotely, the design needs to support date formatting as per the region, and should only show the date not time.

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

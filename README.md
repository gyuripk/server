# Citrus Scribbles Server

## Purpose of the Application

The Citrus Scribbles Server is the backend server for the Citrus Scribbles mobile application. It provides RESTful APIs for user authentication, note management, and data storage. The server is built using Node.js and Express, with a MySQL database for data persistence.

## How to Contribute

To contribute to the development of Citrus Scribbles Server, please follow these steps:

1. **Fork the repository on GitHub:**

   - Navigate to the repository on GitHub.
   - Click on the "Fork" button in the top right corner.

2. **Create a new branch for your feature or bugfix:**

   - Open your terminal and clone your forked repository.
   - Create a new branch using the command `git checkout -b feature/your-feature-name`.

3. **Make your changes:**

   - Make the necessary changes in your code editor.
   - Ensure your code follows the project's coding standards and conventions.

4. **Commit your changes with clear and concise messages:**

   - Use `git add .` to stage your changes.
   - Commit your changes using `git commit -m "Clear and concise commit message"`.

5. **Push your changes to your forked repository:**

   - Push your changes using `git push origin feature/your-feature-name`.

6. **Create a pull request to the main repository:**
   - Navigate to your forked repository on GitHub.
   - Click on the "New Pull Request" button.
   - Provide a detailed description of your changes and submit the pull request.

## Features

- User registration and login with JWT authentication.
- User passwords are securely stored as hashed values.
- Create, read, update, and delete notes.
- Retrieve a list of notes for the authenticated user.
- Secure API endpoints with JWT-based authorization.

## Dependencies

- bcrypt: ^5.1.1
- cookie-parser: ~1.4.4
- cors: ^2.8.5
- debug: ~2.6.9
- dotenv: ^16.4.5
- express: ~4.16.1
- helmet: ^7.1.0
- http-errors: ~1.6.3
- jade: ~1.11.0
- jsonwebtoken: ^9.0.2
- knex: ^3.1.0
- morgan: ~1.9.1
- mysql2: ^3.9.7
- nodemon: ^3.1.0
- swagger-jsdoc: ^6.2.8
- swagger-ui-express: ^5.0.0

## Installation

1. **Clone the repository:**

   - Run `git clone https://github.com/rbfl6418/server.git` in your terminal.

2. **Navigate to the project directory:**

   - Use the command `cd server`.

3. **Install the dependencies:**

   - Run `npm install` to install all the necessary dependencies.

4. **Create a `.env` file with your database configuration and JWT secret key:**

   - The `.env` file should include the following variables:
     ```
     DB_HOST=your-database-host
     DB_USER=your-database-username
     DB_PASSWORD=your-database-password
     DB_NAME=your-database-name
     SECRET_KEY=your-jwt-secret-key
     ```

5. **Start the development server:**
   - Use `npm run dev` to start the server in development mode with nodemon.

## Architecture

The server is built using Node.js and Express. It uses Knex.js to interact with a MySQL database. The server follows a modular architecture with separate route files for users, notes, and Swagger documentation.

### Core Components

1. **Routes:**

   - **`/users`**: Handles user registration and login.
   - **`/notes`**: Manages note creation, retrieval, update, and deletion.
   - **`/swagger`**: Provides API documentation using Swagger.

2. **Middleware:**

   - **Helmet**: Adds security headers to API responses.
   - **Cors**: Enables Cross-Origin Resource Sharing.
   - **Morgan**: HTTP request logger for logging requests.
   - **cookie-parser**: Parses cookies attached to the client request object.
   - **express.json()**: Parses incoming requests with JSON payloads.
   - **express.urlencoded()**: Parses incoming requests with URL-encoded payloads.

3. **Database:**

   - **MySQL**: Used for data storage and retrieval.
   - **Knex.js**: SQL query builder for interacting with the MySQL database.

4. **Authentication and Authorization:**
   - **JWT Authentication**: Ensures secure access to API endpoints through token-based authentication.
   - **bcrypt**: For hashing passwords before storing them in the database.

## Reporting Issues

If you encounter any issues or bugs, please report them by creating a new issue in the GitHub repository. Provide a detailed description of the problem and steps to reproduce it. Include screenshots if applicable.

## Swagger API Documentation

The API is documented using Swagger. You can view the API documentation by navigating to `/api-docs` in your browser after starting the server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

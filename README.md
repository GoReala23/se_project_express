# WTWR (What to Wear?): Back End

The WTWR back-end project is focused on creating a server for the WTWR application. This project involves working with databases, setting up security and testing, and deploying web applications on a remote machine. The goal is to create a server with an API and user authorization.authorization.

## Project Description

- The WTWR (What to Wear?) project aims to help users decide what to wear based on the weather.
- Users can create an account, log in, add clothing items to their wardrobe, and like or unlike clothing items.
- The back end of the application provides a RESTful API for handling user authentication, managing user data, and performing CRUD operations on clothing items.

## Technologies Used

- Node.js: JavaScript runtime environment for executing server-side code.
- Express.js: Web framework for building the RESTful API.
- MongoDB: NoSQL database for storing user and clothing item data.
- Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
- JWT (JSON Web Tokens): For user authentication and session management.
- bcryptjs: Library for hashing passwords.
- validator: Library for validating and sanitizing strings.
- dotenv: Module to load environment variables from a .env file into process.env.
- Nodemon: Tool for automatically restarting the server during development.
- cors: Package to allow/disable Cross-Origin Resource Sharing (CORS).

# Functionality

User Authentication: Users can sign up and log in. Passwords are securely hashed, and JSON Web Tokens (JWT) are used for session management.
User Management: Users can update their profile information and view their own data.
Clothing Items Management: Users can add, view, and delete clothing items. Users can also like

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

# WTWR (What to Wear?): Back End

The WTWR back-end project is focused on creating a server for the WTWR application. This project involves working with databases, setting up security and testing, and deploying web applications on a remote machine. The goal is to create a server with an API and user authorization.

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

## Functionality

- User Authentication: Users can sign up and log in. Passwords are securely hashed, and JSON Web Tokens (JWT) are used for session management.
- User Management: Users can update their profile information and view their own data.
- Clothing Items Management: Users can add, view, and delete clothing items. Users can also like or unlike clothing items.

## Running the Project

### Prerequisites

- Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Backend Repository

You can find the backend repository here: [Backend Repository](https://github.com/GoReala23/se_project_express)

### How to Run the Backend

1. **Clone the backend repository:**

   git clone https://github.com/GoReala23/se_project_express.git

2. **Navigate to the project directory:**
   cd se_project_express

3 **Install the dependencies:**
npm install

4 **Set up environment variables:**

- Create a .env file in the root of the project.
- Add the necessary environment variables (e.g., database connection string).

env

MONGO_URI=your-mongodb-connection-string
PORT=5000
JWT_SECRET=your-jwt-secret

5 **Start the backend server:**

npm run start
The server should be running on http://localhost:5000

npm run dev
Testing
Before committing your code, make sure you edit the file sprint.txt in the root folder. The file sprint.txt should contain the number of the sprint you're currently working on. For example: 12

// Import the 'app' module, which likely contains your Express.js application setup.
const app = require("./app")

const cloudinary = require('cloudinary').v2

// Import the 'dbConnection' function, which establishes a connection to MongoDB.
const dbConnection = require("./database");

// Import the 'dotenv' library for configuring environment variables.
const dotenv = require('dotenv');

// Configure environment variables using a .env file located in the 'backend/config/' directory.
dotenv.config({ path: 'backend/config/.env' });

//------------ MongoDB Connection ------------//

// Call the 'dbConnection' function to establish a connection to MongoDB.
dbConnection()


// Create an HTTP server using your Express.js application and listen on the specified port.
const server = app.listen(process.env.PORT, () => {
  console.log(`Starting development server at http://127.0.0.1:${process.env.PORT}`);
});

// Handling Promise Rejection Error

// Listen for unhandled promise rejection errors.
process.on('unhandledRejection', (error) => {
  // Log the error message to the console.
  console.log(`Error: ${error.message}`);

  // Log a message indicating that the server is shutting down due to the unhandled rejection error.
  console.log(`Server is shut down due to unhandledRejectionError`);

  // Close the server gracefully, then exit the process with a status code of 1 (indicating an error).
  server.close(() => {
    process.exit(1);
  });
});

// database.js
// This module establishes a connection to a MongoDB database using Mongoose.

// Import the Mongoose library, which allows us to interact with MongoDB.
const mongoose = require('mongoose');


// // Define a function called dbConnection that establishes a connection to the database.
const dbConnection = () => {
//     // Use Mongoose to connect to the MongoDB database.
//     // The connection parameters are provided through environment variables.
     mongoose.connect("mongodb+srv://samiali:tnz4LyYgMfQEuKoz@cluster0.5aycxc3.mongodb.net/ziraat?retryWrites=true&w=majority", {
        useNewUrlParser: true,            // Use the new URL parser.
         useUnifiedTopology: true,        // Use the new Server Discover and Monitoring engine.
         family: 4,                       // Use IPv4 for the connection (optional).
     }).then((data) => {
        // If the connection is successful, log a message indicating the connection host.        
        console.log(`Connected to MongoDB at ${data.connection.host}`);
    })
}

// Export the dbConnection function to make it accessible to other parts of the application.
module.exports = dbConnection;

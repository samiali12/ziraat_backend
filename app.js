const os = require('os');
console.log('Temporary directory:', os.tmpdir());


const productsRoute = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const requestQuoteRoute = require('./routes/requestQuoteRoute')
const authRoute = require('./routes/authRoutes');
const searchRoute = require('./routes/searchRoute')
const ImageUploadrouter = require("./routes/imageUploadRoutes");

const errorHandlerMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const session = require('./session');
const passport = require('passport');
const multer = require('multer');
const fileUploader = require('express-fileupload')




// Express Middleware Configuration

// Parse incoming JSON data.
app.use(express.json({ limit: '10mb' }))

// Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins.
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Enable cookies and sessions
}));

// Parse JSON data from request bodies.
app.use(bodyParser.json());

app.use(fileUploader({
  useTempFiles: true,
  tempFileDir: 'C:\Users\Sami\AppData\Local\Temp\Ziraat',}))

// Cookie Parser Configuration

// Parse cookies from incoming requests.
app.use(cookieParser());

// Use session to store user data.
session(app);

// Configure session serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Error Handling Middleware

// Handle errors in the application.
app.use(errorHandlerMiddleware);

// Define Routes

// Mount 'productsRoute' middleware under the "/api/v1" path.
app.use("/api/v1", productsRoute);

// Mount 'userRoutes' middleware under the "/api/v1" path.
app.use("/api/v1", userRoutes);

// Mount 'authRoute' middleware under the "/api/v1" path.
app.use("/api/v1/", authRoute);

// Mount 'request-quote' middle under the '/api/v1/' path
app.use("/api/v1/", requestQuoteRoute)

// Mount File uploading middleware under the "/api/v1/" path. 
app.use("/api/v1/", ImageUploadrouter);

app.use('/api/v1', searchRoute)

// Export the configured Express application to be used elsewhere.
module.exports = app;

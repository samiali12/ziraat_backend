const express = require('express')
const ImageUploadrouter = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('cloudinary').v2; // Import Cloudinary


// Configure Cloudinary with your API credentials (you should have done this in the config/cloudinary.js file)
cloudinary.config({
    cloud_name: 'dss4xjbc8',
    api_key: '192813273465878',
    api_secret: 'X0F6Assd5N9QBB-wsoyJHjrKgPA',
});


// Create a route for image uploads to Cloudinary
ImageUploadrouter.post('/cloudinary-upload',async (req, res) => {

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: 'No file was uploaded' });
        }

        const file = req.files.file;
        const filePath = file.tempFilePath; // Get the file path correctly


        // Upload the file to Cloudinary
        cloudinary.uploader.upload(filePath, {folder: 'ProfileAvatar'},  (err, result) => {
            if (err) {
                console.error('Error uploading image to Cloudinary:', err);
                res.status(500).json({ success: false, message: 'Image upload to Cloudinary failed' });
            } else {
                // Send the Cloudinary response back to the client
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error handling image upload:', error);
        res.status(500).json({ success: false, message: 'Image upload error' });
    }
});

module.exports = ImageUploadrouter;
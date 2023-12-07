const express = require('express');
const {
    registerUser,
    loginUser,
    getUserDetails,
    logoutUser,
    requestPasswordReset,
    resetPassword,
    updatePassword,
    deleteUser,
    updateUserProfile,
    verifyUserEmail,
    sendEmailVerification,
} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authentication');

const router = express.Router();

router.route("/user").post(registerUser); // User registration route.
router.route("/users/login").post(loginUser); // User login route.
router.route("/users/logout").get(logoutUser); // User logout route.
router.route("/users/:userId/verify-email/:token").put(verifyUserEmail); // Verify user email route.
router.route("/users/send-email-verification").post(sendEmailVerification); // Send email verification route.
router.route("/users/request-password-reset").post(requestPasswordReset); // Request password reset route.
router.route("/users/reset-password/:token").put(resetPassword); // Reset password route.
router.route("/users/update-password/:id").put(updatePassword); // Update password route.
router.route("/users/:userId").get(isAuthenticated, getUserDetails); // Get user details route.
router.route("/users/:userId/update-profile").put(isAuthenticated, updateUserProfile); // Update user profile route.
router.route("/users/:userId/delete").delete(isAuthenticated, deleteUser); // Delete user account route.

module.exports = router;

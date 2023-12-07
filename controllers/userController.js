const bcrypt = require('bcrypt');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('../middleware/asyncErrorHandler');
const sendEmail = require("../utils/messages")


const registerUser = asyncErrorHandler(async (request, response, next) => {

    // getting required attribute during the registration
    const { email, password, role } = request.body

    if (await User.findOne({ email })) {
        return response.status(401).json({
            message: "Email is already exits. Try different"
        })
    }

    const user = await User.create({ email, password, role })

    const verificationToken = user.generateEmailVerificationToken()

    const emailVerificationUrl = `http://localhost:3000/verify-email/token/${verificationToken}`

    try {

        sendEmail({
            email: user.email,
            subject: "Ziraat-B2B Email Verification",
            message: `Click the below link to verify your email \n ${emailVerificationUrl}`
        })


        await user.save()

        request.session.user = {
            id: user._id, email: user.email
        }


        response.status(200).json({
            success: true,
            message: "User Registerd Successfully",
            user
        })

    }

    catch (error) {
        return response.status(401).json({
            message: "Some things wrong happening",
            success: false
        })
    }
})

const sendEmailVerification = asyncErrorHandler(async (request, response, next) => {

    const user = await User.findOne({ email: request.body.email });


    if (!user) {

        return response.status(401).json({
            message: "Some things wrong happening",
            success: false
        })
    }

    try {

        const verificationToken = user.generateEmailVerificationToken()
        const emailVerificationUrl = `http://localhost:3000/verify-email/token/${verificationToken}`
        sendEmail({
            email: user.email,
            subject: "Ziraat-B2B Email Verification",
            message: `Click the below link to verify your email \n ${emailVerificationUrl}`
        })

        await user.save({ validateBeforeSave: false })
        return response.status(200).json({
            success: true,
            message: "Email verification link is send"
        })
    }
    catch (err) {
        return response.status(501).json({
            success: false,
            message: "Some things wrong happening. Try gain later"
        })
    }



})

const loginUser = asyncErrorHandler(async (request, response, next) => {

    const { email, password } = request.body

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return response.status(401).json({
            success: false,
            message: "Invalid Email"
        })
    }


    // Compare the provided password with the stored password
    const hashPassword = await bcrypt.compare(password, user.password)

    if (!hashPassword) {
        return response.status(401).json({
            success: false,
            message: "Invalid Password"
        })
    }
    else {
        request.session.user = {
            id: user.id,
            email: user.email
        }

        return response.status(200).json({
            success: false,
            message: "User Login Successfully",
            data: user,
        })

    }

})

const verifyUserEmail = asyncErrorHandler(async (request, response, next) => {

    const token = request.params.token

    const newToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({ emailVerificationToken: newToken })

    if (!user) {

        return response.status(401).json(
            {
                success: false,
                message: "Something wrong happening"
            })
    }


    user.verified = true
    user.emailVerificationToken = undefined
    user.emailVerificationTokenExpireDate = undefined

    await user.save({ validateBeforeSave: true })

    response.status(200).json({
        success: true,
        message: "Email verified Successfully"
    })
})

const logoutUser = asyncErrorHandler(async (request, response, next) => {

    try {
        await request.session.destroy();
        response.status(200).json({
            message: "User is Logout Successfully",
            success: true
        });
    } catch (error) {
        console.error('Error destroying session:', error);
        response.status(500).json({
            message: 'Logout failed',
            success: false
        });
    }


})

const requestPasswordReset = asyncErrorHandler(async (request, response, next) => {

    const user = await User.findOne({ email: request.body.email });

    if (!user) {
        return response.status(401).json({
            success: false,
            message: "Ziraat-B2B have no email"
        })
    }

    // Get reset password token
    const passwordToken = user.generateNewPasswordToken()

    await user.save({ validateBeforeSave: false })
    const resetPasswordUrl = `http://localhost:3000/password-reset/token/${passwordToken}`
    const message = `Your password reset token is \n ${resetPasswordUrl}`

    try {

        await sendEmail({
            email: user.email,
            subject: "Ziraat-B2B Password Recovery",
            message,
        })

        response.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPassswordExpireDate = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }

})

const resetPassword = asyncErrorHandler(async (request, response, next) => {


    resetPasswordToken = crypto.createHash('sha256').update(request.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
    })

    if (!user) {

        return response.status(401).json({
            success: false,
            message: "Reset password token is invalid or has been expired"
        })
    }

    user.password = request.body.password
    user.resetPasswordToken = undefined
    user.resetPassswordExpireDate = undefined

    await user.save()

    sendToken(user, 200, response, "Password Reset Successfully")

})

// update user password 
const updatePassword = asyncErrorHandler(async (request, response, next) => {

    const user = await User.findOne({ _id: request.params.id }).select('+password')

    const isPassword = await bcrypt.compare(request.body.currentPassword, user.password)

    if (!isPassword) {
        response.status(501).json({
            success: false,
            message: "Type correct Old Password"
        })
    }
    else {
        user.password = request.body.newPassword;
        await user.save().then( () => {
            response.status(200).json({
                success: true,
                message: "Password is changed Successfully"
            })
        })
    }
})


// Get User Details
const getUserDetails = asyncErrorHandler(async (request, response, next) => {

    const user = await User.findOne({ _id: request.params.userId })

    response.status(200).json({
        success: true,
        user
    })
})

const updateUserProfile = asyncErrorHandler(async (request, response, next) => {
    try {
        const userId = request.params.userId;
        const updatedUserData = request.body;

        let user = await User.findOne({ _id: userId });


        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        user = await User.findByIdAndUpdate(userId, updatedUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        console.log('Updated User:', user);

        response.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return next(new ErrorHandler("Error updating user profile", 500));
    }
});


const deleteUser = asyncErrorHandler(async (request, response, next) => {

    let user = await User.findOne({ _id: request.params.userId })

    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }

    await User.findByIdAndRemove(user._id)

    response.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })

})

// Export the controller functions
module.exports = {
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
    sendEmailVerification
}
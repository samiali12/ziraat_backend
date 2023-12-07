const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwtToken = require('jsonwebtoken')
const crypto = require('crypto')
const asyncErrorHandler = require('../middleware/asyncErrorHandler');


const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        default: null
       
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,

    },

    phoneNumber: {
        type: String,
        default: null
    },

    password: {
        type: String,
        select: false

    },

    companyName: {
        type: String,
        default: undefined
      
    },

    sales: {
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        }
    },
    
    productCount: {
        type: Number,
        default: 0,
    },

    location: {
        addressLine1: {
            type: String,
             default: undefined
           
        },
        addressLine2: {
            type: String,
             default: undefined
           
        },
        state: {
            type: String,
            default: undefined
            
        },
        city: {
            type: String,
            default: undefined
            
        },
        postalCode: {
            type: String,
            default: undefined
        },
        country: {
            type: String,
            default: "Pakistan"
        }
    },

    profilePicture: {
        public_id: {
            type: String,
             default: undefined
            
        },
        image_url: {
            type: String,
            default: undefined
            
        },
    },

    currentRole: {
        type: String,
         default: "buyer",
    },

    role: {
        type: String,
        default: "buyer",
    },

    verified: {
        type: Boolean,
        required: true,
        default: false
    },


    emailVerificationToken: String,
    emailVerificationTokenExpireDate: Date,

    resetPasswordToken: String,
    resetPassswordExpireDate: Date,
});


userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)

})


// JWT TOken
userSchema.methods.getJWTToken = function (next) {

    const payload = {
        _id: this._id,
        email: this._email
    }
    return jwtToken.sign(payload, process.env.JWT_SECRET_KEY)
}

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function (next) {

    const token = crypto.randomBytes(32).toString('hex')
    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex')
    return token
};

// Generate password reset token
userSchema.methods.generateNewPasswordToken = function (next) {

    const token = crypto.randomBytes(32).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    this.resetPassswordExpireDate = Date.now() + 60 * 60 * 1000
    return token
}


const User = mongoose.model('User', userSchema);
module.exports = User;
import mongoose from "mongoose";
//? Removed unnecessary imports that were causing MODULE_NOT_FOUND error


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,

    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    VerifyToken: String,
    VerifyTokenExpiry: Date


})

const User = mongoose.models.users || mongoose.model("users", userSchema) //? At the end of the day mongodb will make it into lowercase and prural

export default User;
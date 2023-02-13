import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: String,
        requeired: true,
        unique: true
    },
    name: {
        type: String,
        requeired: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true,
        minlength: 5
    },
    image: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
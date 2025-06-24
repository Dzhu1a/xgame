// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    name: String,
    email: String,
    phone: String,
    city: String,
    address: String,
    newPostOffice: String,
});

const User = mongoose.model('User', userSchema);

export default User;

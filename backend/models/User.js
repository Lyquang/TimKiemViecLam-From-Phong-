const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    userName: String,
    userEmail: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    dayofBirth: Date,
    address: String,
    role: String,
    CVs: [
        {
            cvLink: String,
            cvName: String
        }
    ]
}); 
module.exports = mongoose.model('User', UserSchema);

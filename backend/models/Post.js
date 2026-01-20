const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    salary: String,
    address: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: [String],
    companyName: String
}); 
module.exports = mongoose.model('Post', PostSchema);
const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, 
    job_name: { type: String, required: true },
    applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    cv: { type: String, required: true }, 
    appliedAt: { type: Date, default: Date.now } ,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);

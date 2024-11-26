const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    career: {
        type: [String],  // Array of strings for career levels
        required: true
    },
    education: {
        type: String,
        required: true
    },
    job_sector: {
        type: [String],  // Array of strings for job sectors
        required: true
    },
    views: {
        type: Number,
        default: 0  // Default value for views
    },
    salary:{
        type: mongoose.Schema.Types.Mixed,
    }
}, { timestamps: true });  // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Job', jobSchema);

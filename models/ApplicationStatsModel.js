const mongoose = require('mongoose');

const jobApplicationStatsSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Job'
    },
    totalApplications: {
        type: Number,
        default: 0
    },
    accepted: {
        type: Number,
        default: 0
    },
    rejected: {
        type: Number,
        default: 0
    },
    pending: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const JobApplicationStats = mongoose.model('JobApplicationStats', jobApplicationStatsSchema);
module.exports = JobApplicationStats;

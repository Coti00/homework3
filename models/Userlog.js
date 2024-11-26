const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    activityType: {
        type: String,
        required: true,
        enum: ['login','logout'],
    },
    description: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const UserLog = mongoose.model('UserLog', userLogSchema);
module.exports = UserLog;

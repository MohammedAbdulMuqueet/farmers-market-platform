const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedback: { type: String, required: true },
    userEmail: { type: String, required: true },  
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

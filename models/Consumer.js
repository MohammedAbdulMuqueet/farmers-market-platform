const mongoose = require('mongoose');

const consumerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true }
});

const Consumer = mongoose.model('Consumer', consumerSchema);

module.exports = Consumer;
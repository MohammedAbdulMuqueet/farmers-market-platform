const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    farmName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
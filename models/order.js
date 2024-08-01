const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    consumerEmail: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

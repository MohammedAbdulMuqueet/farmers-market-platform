const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [String] 
});

module.exports = mongoose.model('Product', productSchema);

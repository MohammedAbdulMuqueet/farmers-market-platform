const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmer');
const Consumer = require('../models/consumer');
const Product = require('../models/product');
const Order = require('../models/order');
const Feedback = require('../models/Feedback');
const authenticate = require('../middleware/authenticate');
const generateToken = require('../utils/generateToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@farmersmarket.com' && password === 'admin@123') {
        try {
            const token = jwt.sign(
                { email, userType: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
router.post('/feedback', authenticate, async (req, res) => {
    const { feedback } = req.body;
    if (!feedback) {
        return res.status(400).json({ message: 'Feedback is required' });
    }
    try {
        const newFeedback = new Feedback({
            feedback,
            userEmail: req.user.email
        });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/feedback', authenticate, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().select('userEmail feedback');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
});
router.delete('/feedback', authenticate, async (req, res) => {
    if (req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        await Feedback.deleteMany({});
        res.status(200).json({ message: 'All feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete feedback', error: error.message });
    }
});
router.post('/farmer-register', async (req, res) => {
    const { name, email, password, farmName, location } = req.body;
    try {
        const existingFarmer = await Farmer.findOne({ email });
        if (existingFarmer) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFarmer = new Farmer({ name, email, password: hashedPassword, farmName, location });
        await newFarmer.save();
        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});
router.post('/consumer-register', async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        const existingConsumer = await Consumer.findOne({ email });
        if (existingConsumer) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newConsumer = new Consumer({ name, email, password: hashedPassword, address });
        await newConsumer.save();
        res.status(201).json({ message: 'Consumer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});
router.post('/farmer-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const farmer = await Farmer.findOne({ email });
        if (farmer && await bcrypt.compare(password, farmer.password)) {
            const token = generateToken({ email: farmer.email, userType: 'farmer' });
            res.json({ token });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});
router.post('/consumer-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const consumer = await Consumer.findOne({ email });
        if (consumer && await bcrypt.compare(password, consumer.password)) {
            const token = generateToken({ email: consumer.email, userType: 'consumer' });
            res.json({ token });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});
router.post('/add-product', authenticate, upload.array('images', 10), async (req, res) => {
    const { productName, quantity, price, category } = req.body;
    const imageFiles = req.files;
    try {
        if (req.user.userType !== 'farmer') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const imageUrls = imageFiles.map(file => `/uploads/${file.filename}`);
        const newProduct = new Product({
            productName,
            quantity,
            price,
            category,
            images: imageUrls
        });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
});
router.get('/products/id/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
});
router.get('/products/category/:category', async (req, res) => {
    const { category } = req.params;

    try {
        const products = await Product.find({ category });
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
});
router.delete('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        products.forEach(product => {
            product.images.forEach(imageUrl => {
                const filePath = path.join(__dirname, '..', imageUrl);
                fs.unlink(filePath, err => {
                    if (err) console.error(`Failed to delete image ${filePath}:`, err);
                });
            });
        });
        await Product.deleteMany({});
        res.status(200).json({ message: 'All products have been deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete products', error: error.message });
    }
});
router.get('/categories', async (req, res) => {
    try {
        const allowedCategories = ['Fruits', 'Vegetables', 'Dairy'];
        const categories = await Product.distinct('category');
        const filteredCategories = categories.filter(category => allowedCategories.includes(category));
        res.status(200).json({ categories: filteredCategories });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
});
router.post('/place-order', authenticate, async (req, res) => {
    const { productId, quantity, cardNumber, expiryDate } = req.body;
    try {
        if (req.user.userType !== 'consumer') {
            return res.sendStatus(403);
        }
        const product = await Product.findById(productId);
        if (!product || product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity or product not found' });
        }
        const newOrder = new Order({
            consumerEmail: req.user.email,
            productId,
            quantity,
            cardNumber,
            expiryDate
        });
        await newOrder.save();
        product.quantity -= quantity;
        await product.save();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
});
router.get('/orders', authenticate, async (req, res) => {
    if (req.user.userType !== 'consumer') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const orders = await Order.find({ consumerEmail: req.user.email })
            .populate('productId', 'productName price category images') 
            .exec();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
});
module.exports = router;
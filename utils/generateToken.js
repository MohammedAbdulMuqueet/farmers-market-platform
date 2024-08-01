const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ email: user.email, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;

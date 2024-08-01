const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('Decoded token:', decoded);  
        req.user = decoded;
        next();
    });
};

module.exports = authenticate;

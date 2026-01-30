const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Handle "Bearer <token>" format
        const bearerIdx = token.indexOf(' ');
        const tokenString = bearerIdx === -1 ? token : token.substr(bearerIdx + 1);

        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.headers['x-auth-token'];

    // Check for the token
    if(!token) return res.status(400).json({ msg: "No jsonwebtoken present in request" });

    try {
        // Verify Token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user to req from payload
        req.user = decoded;
        next();
    } catch(e) {
        return res.status(400).json({ msg: "Token is invalid" });
    }
}
const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        // const token = req.cookies.jwt;

        // if (!token) {
        //     return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
        // }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Unauthorized - No or Invalid Token Provided" });
        }

        const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in authorization middleware: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = authMiddleware;
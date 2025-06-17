const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from Authorization header: "Bearer <token>"
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user ID to the request object
        req.user = { userId: decoded.userId };

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};
module.exports = isAuthenticated;

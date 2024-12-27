const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.token;

        // If no token, return unauthorized error
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        // Verify the token
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        // If token is invalid or expired
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false
            });
        }

        // Attach user ID to the request object
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        // Return a 500 server error if an exception occurs
        return res.status(500).json({
            message: "Server error, unable to authenticate",
            success: false
        });
    }
};

module.exports = isAuthenticated;

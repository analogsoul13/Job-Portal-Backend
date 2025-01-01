require('dotenv').config();

const connectDB = require('./Connection/db');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const jpServer = express();

// Routes
const userRoutes = require('./Routes/userRoutes')
const companyRoutes = require('./Routes/companyRoutes')
const jobRoutes = require('./Routes/jobRoutes')
const applicationRoutes = require('./Routes/applicationRoute')

// Middlewares
jpServer.use(express.json());
jpServer.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
jpServer.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Routes API
jpServer.use('/api/v1/user', userRoutes); // User-related routes
jpServer.use('/api/v1/company', companyRoutes); // Company-related routes
jpServer.use('/api/v1/job', jobRoutes) // Job related routes
jpServer.use('/api/v1/application', applicationRoutes) // Application related routes

// Global error handling middleware
jpServer.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        success: false,
    });
});

// Connect to the database first, then start the server
connectDB()
    .then(() => {
        jpServer.listen(PORT, () => {
            console.log("Server Running At:", PORT);
        });
    })
    .catch(err => {
        console.error("Database connection failed:", err);
        process.exit(1); // Exit the process if the database connection fails
    });

// Test route
jpServer.get('/', (req, res) => {
    res.send("<h1>jpServer is Active!!</h1>");
});

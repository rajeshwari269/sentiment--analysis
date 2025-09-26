// 1. ENVIRONMENT VARIABLES SETUP (MUST be the first line)
require("dotenv").config(); 

// 2. Core Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const setupSwagger = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
require("./utils/cronJob"); // starts the cron job when the server starts

// 3. Route Imports
const journalRoutes = require("./routes/journal");
const newsRoutes = require("./routes/news");
const authRouter = require("./routes/authRoute");
const analyzeRoutes = require("./routes/analyze");
const contactRoutes = require("./routes/Contact");

const app = express();
const PORT = process.env.PORT || 8080; // Using 8080 as per your .env

// 4. Middleware Setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 5. Session Store Configuration
// The MongoStore must be configured before the session middleware is used.
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Connect-mongo uses the direct URI string
    collectionName: 'sessions', // Optional: specify session collection name
    ttl: 14 * 24 * 60 * 60, // 14 days in seconds
    autoRemove: 'native' // Uses MongoDB's TTL index feature
});

// Session middleware
app.use(session({
    secret: process.env.JWT_USER_SECRET || 'your-fallback-secret-key', // Using a secure secret
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Use the configured MongoStore
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
    }
}));

// Root check route
app.get("/", (req, res) => {
    res.send("Server is alive");
});

// 6. API routes
app.use('/api/journal', journalRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRoutes);

// Error handler
app.use(errorHandler);
setupSwagger(app);

// 404 error handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Error" });
});

// 7. Connect to MongoDB and Start Server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        // Start the server ONLY AFTER the database connection is successful
        app.listen(PORT, () =>
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        );
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });

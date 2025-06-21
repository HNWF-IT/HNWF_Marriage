const cors = require("cors");

// use .env files
require("dotenv").config();
const PORT = process.env.PORT || 8000;

// Initialize DB connection
require("./db")({ connectToDb: true, initializeSeederFile: false });

const { validateRequest } = require("./middlewares/auth");
const candidateRoutes = require("./routes/candidate");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const express = require("express");
const app = express();
app.use(express.json());

// Middleware for handling JSON.
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.options('*', cors()); 

// Protected routes for candidates
app.use("/api/candidate", validateRequest, candidateRoutes);

// Protected routes for books
app.use("/api/book", validateRequest, bookRoutes);

// Protected routes for books
app.use("/api/users", userRoutes);

// Public routes
app.use("/api/auth", authRoutes);

// Test routes
app.get('/envs', (req, res) => {
  res.send(process.env);
});

// Start the server
app.listen(PORT, () =>
  console.log(`[1/2] | 🚀🚀 Server Started - Port: ${PORT}`)
);
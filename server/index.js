const cors = require("cors");
const PORT = process.env.PORT || 8000;

// use .env files
require("dotenv").config();

// Initialize DB connection
require("./db")({ connectToDb: true, initializeSeederFile: false });

const { validateRequest } = require("./middlewares/auth");
const candidateRoutes = require("./routes/candidate");
const authRoutes = require("./routes/auth");

const express = require("express");
const app = express();

// Middleware for handling JSON.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());

// Protected routes.
app.use("/api/candidate", validateRequest, candidateRoutes);

// Public routes.
app.use("/api/auth", authRoutes);

// Start the server
app.listen(PORT, () =>
  console.log(`[1/2] | 🚀🚀 Server Started - Port: ${PORT}`)
);
const cors = require("cors");

// use .env files
require("dotenv").config();
const PORT = process.env.PORT || 8000;

// Initialize DB connection
require("./db")({ connectToDb: true, initializeSeederFile: false });

const { validateRequest, requireAdmin, requirePermission } = require("./middlewares/auth");
const candidateRoutes = require("./routes/candidate");
const bookRoutes = require("./routes/book");
const bookGenreRoutes = require('./routes/bookGenre');
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const express = require("express");
const app = express();

// Middleware for handling JSON.
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.options('*', cors()); 

// After CORS, Handle express json!
app.use(express.json());

// Protected routes for candidates (Marriage app - requires 'marriage' permission)
app.use("/api/candidate", validateRequest, requirePermission('marriage'), candidateRoutes);

// Protected routes for books (Library app - requires 'library' permission)
app.use("/api/book", validateRequest, requirePermission('library'), bookRoutes);

// Protected routes for book Genres (Library app - requires 'library' permission)
app.use('/api/bookGenre', validateRequest, requirePermission('library'), bookGenreRoutes);

// Protected routes for users (Admin only)
app.use("/api/user", validateRequest, requireAdmin, userRoutes);

// Protected routes for dashboard (Admin only)
app.use("/api/dashboard", validateRequest, requireAdmin, dashboardRoutes);

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
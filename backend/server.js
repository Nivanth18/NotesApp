// Load environment variables FIRST — before anything else
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const mongoose= require('mongoose');

const app = express();

// ── Middleware ──────────────────────────────────────────────
// Middleware runs before every request reaches your routes.
// express.json() parses incoming JSON request bodies.
// cors() allows requests from your frontend domain.
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Routes ─────────────────────────────────────────────────
// Import our route files (we'll create these next)
const authRoutes  = require('./routes/auth');
const notesRoutes = require('./routes/notes');

// Mount routes at URL prefixes
app.use('/api/auth',  authRoutes);
app.use('/api/notes', notesRoutes);

// Health check route — useful to verify the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Notes API is running!' });
});

// ── Connect to MongoDB, then start the server ───────────────
// We connect to the database FIRST. Only after a successful
// connection do we start listening for HTTP requests.
// This prevents requests arriving before the DB is ready.
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // exit if DB fails
  });
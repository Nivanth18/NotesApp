const express  = require('express');
const Note     = require('../models/Note');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply authMiddleware to ALL routes in this file.
// Every request to /api/notes/* must have a valid JWT token.
router.use(authMiddleware);

// ── GET /api/notes ── Get all notes for the logged-in user
router.get('/', async (req, res) => {
  try {
    // req.user.id is set by authMiddleware from the JWT token
    const notes = await Note
      .find({ user: req.user.id })
      .sort({ updatedAt: -1 }); // newest first
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/notes ── Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const note = await Note.create({
      title,
      body: body || '',
      user: req.user.id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PUT /api/notes/:id ── Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, body } = req.body;

    // Find the note AND verify it belongs to this user
    // This prevents users from editing other users' notes
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, body },
      { new: true } // return the updated document, not the old one
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── DELETE /api/notes/:id ── Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
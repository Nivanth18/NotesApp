const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    body: {
      type: String,
      default: '',
      maxlength: 5000,
    },
    // ref: 'User' creates a relationship — this field stores a User's _id.
    // When we query notes, we can .populate('user') to get the full user object.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
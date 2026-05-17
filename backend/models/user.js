const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// Schema defines the shape of a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,         // removes leading/trailing spaces
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,       // no two users with same email
      lowercase: true,   // store as lowercase always
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
  },
  {
    // timestamps: true auto-adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ── Pre-save hook ───────────────────────────────────────────
// This runs automatically BEFORE saving a user to the database.
// It hashes the password so we never store plain text passwords.
// bcrypt.hash('password123', 10) → '$2a$10$...' (hashed string)
// The 10 is the "cost factor" — higher = more secure but slower.
// Async pre hooks must not use `next` — Mongoose waits on the returned promise.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method ─────────────────────────────────────────
// Methods added to the schema are available on every User document.
// user.comparePassword('entered_password') → true/false
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the model — 'User' becomes the MongoDB collection name
module.exports = mongoose.model('User', userSchema);
const mongoose = require("mongoose");

// Define the BookGenre schema
const bookGenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String
}, {
  timestamps: true
});

// Create the model
const BookGenre = mongoose.model('BookGenre', bookGenreSchema);

module.exports = BookGenre;

const mongoose = require("mongoose");

// Define the book schema with updated fields and enums
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationYear: { type: String, required: true },
  genre: { 
    type: String, 
    enum: ["Comparative Religion", "Islam", "Christianity", "Judaism"], 
    required: true 
  },
  isbn: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Available", "Checked Out", "Reserved", "Lost"], 
    required: true 
  },
  shelfLocation: { type: String, required: true },
  language: { 
    type: String, 
    enum: ["Urdu", "Arabic", "English", "Other"], 
    required: true 
  },
  pageCount: { type: String, required: true },
});

// Create the model from the schema
const Book = mongoose.model('Book', bookSchema);

// Export the model
module.exports = Book;
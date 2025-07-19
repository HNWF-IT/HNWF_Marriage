const mongoose = require("mongoose");

// Define the book schema with updated fields and enums
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationYear: { type: String, required: true },
  publisher: { type: String, required: true },
  genre: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BookGenre',
    required: true 
  },
  isbn: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ["Available", "Checked Out", "Reserved", "Lost"], 
    required: true,
    default: "Available"
  },
  shelfLocation: { type: String },
  // Not needed. Need to remove in future
  language: { 
    type: String, 
    enum: ["Urdu", "Arabic", "English", "Other"], 
    required: true 
  },
  // Not needed. Need to remove in future
  pageCount: { type: String },
  description: { type: String },
  borrowerInfo: { type: String },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{
  timestamps: true
});

// Create the model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

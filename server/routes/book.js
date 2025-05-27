const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Create a new book
router.post('/create', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Missing book data', data: {} });
    }

    const newBook = new Book({ ...req.body });
    const book = await newBook.save();

    res.status(201).json({ success: true, message: 'Book created successfully', data: book });
  } catch (err) {
    /*** Unique constraint (ISBN) violation error handling */
    if(err.code === 11000 && err.name === 'MongoServerError' && err.keyValue.isbn) {
      return res.status(400).json({ success: false, message: 'Book not Added. Duplicate ISBN', data: {} });
    }
    res.status(400).json({ success: false, message: 'Error creating book', data: err });
  }
});

// Get all books with optional filters
router.post('/list', async (req, res) => {
  try {
    const filters = req.body?.filters || {};
    const books = await Book.find(filters);

    res.status(200).json({ success: true, message: 'Books returned successfully', data: books });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching books', data: err });
  }
});

// Get a book by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing book ID', data: {} });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'Book fetched', data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching book', data: err });
  }
});

// Update a book by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || !updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing ID or update data',
        data: {},
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: 'Book not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (err) {
    /*** Unique constraint (ISBN) violation error handling */
    if(err.code === 11000 && err.name === 'MongoServerError' && err.keyValue.isbn) {
      return res.status(400).json({ success: false, message: 'Book Not Updated. Duplicate ISBN', data: {} });
    }
    res.status(400).json({ success: false, message: 'Error updating book', data: err });
  }
});

// Delete a book by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing book ID', data: {} });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: 'Book not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'Book deleted successfully', data: deletedBook });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error deleting book', data: err });
  }
});

// Check Out a Book
router.put('/checkout', async (req, res) => {
  try {
    const { bookId, borrowerInfo, mode } = req.body;
    if(!borrowerInfo.fullName || 
      !borrowerInfo.contactNumber || 
      !borrowerInfo.issueDate || 
      !borrowerInfo.dueDate) {
      return res.status(400).json({ success: false, message: 'Missing Borrower Info', data: {} });  
    }

    let updateFields = {};
    if (mode === 'checkout') {
      updateFields = {
        borrowerInfo: JSON.stringify(borrowerInfo),
        status: "Checked Out",
      };
    } else if (mode === 'return') {
      updateFields = {
        borrowerInfo: null,
        status: "Available",
      };
    } else {
      return res.status(400).json({ success: false, message: 'Invalid mode', data: {} });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateFields,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, error: 'Book not found', data: {} });
    }

    return res.json({ success: true, message: 'Book status updated', data: updatedBook });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating book', data: err });
  }
});

module.exports = router;
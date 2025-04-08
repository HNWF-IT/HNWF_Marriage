import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';

// Hardcoded enum values
const BookStatus = {
  AVAILABLE: 'Available',
  CHECKED_OUT: 'Checked Out',
  RESERVED: 'Reserved',
  LOST: 'Lost'
};

const BookGenre = {
  FICTION: 'Fiction',
  NON_FICTION: 'Non-Fiction',
  SCIENCE: 'Science',
  HISTORY: 'History',
  BIOGRAPHY: 'Biography',
  FANTASY: 'Fantasy'
};

const BookLanguage = {
  ENGLISH: 'English',
  SPANISH: 'Spanish',
  FRENCH: 'French',
  GERMAN: 'German',
  OTHER: 'Other'
};

const BookModal = ({ mode, bookData, show, handleClose }) => {
  // Hardcoded form data
  const formData = bookData || {
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    publisher: '',
    genre: '',
    language: '',
    pageCount: '',
    status: '',
    shelfLocation: '',
    description: ''
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Book ${mode === 'add' ? 'added' : 'updated'} successfully!`);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{backgroundColor: "#2c3e50", color: "white"}}>
        <Modal.Title>{mode === "edit" ? "Edit Book" : "Add New Book"}</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div className="p-4 rounded shadow-sm">
            <h5 style={{color: "#3498db"}}>Basic Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter book title"
                    defaultValue={formData.title}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter author name"
                    defaultValue={formData.author}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ISBN (10 or 13 digits)"
                    defaultValue={formData.isbn}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publication Year</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter publication year"
                    defaultValue={formData.publicationYear}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 style={{color: "#3498db"}}>Classification</h5>
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Select defaultValue={formData.genre} required>
                    <option value="">Select Genre</option>
                    {Object.values(BookGenre).map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select defaultValue={formData.language} required>
                    <option value="">Select Language</option>
                    {Object.values(BookLanguage).map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Page Count</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Enter page count"
                    defaultValue={formData.pageCount}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 style={{color: "#3498db"}}>Inventory Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={formData.status} required>
                    <option value="">Select Status</option>
                    {Object.values(BookStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Shelf Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter shelf location (e.g., A12-3)"
                    defaultValue={formData.shelfLocation}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 style={{color: "#3498db"}}>Additional Information</h5>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter book description"
                    defaultValue={formData.description}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" style={{backgroundColor: "#2c3e50", borderColor: "#2c3e50"}}>
            {mode === 'add' ? "Add Book" : "Update Book"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookModal;
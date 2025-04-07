import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Collapse, Table, Pagination } from 'react-bootstrap';
import { BookFill } from 'react-bootstrap-icons';

// Hardcoded book data
const sampleBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publicationYear: 1925,
    genre: 'Fiction',
    isbn: '9780743273565',
    status: 'Available',
    shelfLocation: 'FIC-101'
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publicationYear: 1960,
    genre: 'Fiction',
    isbn: '9780061120084',
    status: 'Checked Out',
    shelfLocation: 'FIC-102'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    publicationYear: 1949,
    genre: 'Science Fiction',
    isbn: '9780451524935',
    status: 'Available',
    shelfLocation: 'SCI-201'
  },
  // Add more sample books as needed
];

// Hardcoded enums
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

const BookList = () => {
  const [books] = useState(sampleBooks);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    status: '',
    language: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Filter books based on filters
  const filteredBooks = books.filter(book => {
    return (
      book.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      book.author.toLowerCase().includes(filters.author.toLowerCase()) &&
      (filters.genre === '' || book.genre === filters.genre) &&
      (filters.status === '' || book.status === filters.status)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
      status: '',
      language: ''
    });
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0" style={{color: "#2c3e50"}}>Library Dashboard</h2>
            <div className="d-flex gap-3">
              <Button 
                variant="outline-success" 
                className="d-flex align-items-center"
                size='sm'
                onClick={() => alert('Add Book functionality would go here')}
              >
                <i className="bi bi-plus"></i>
                Add Book
              </Button>

              <Button 
                variant="outline-primary" 
                className="d-flex align-items-center"
                size='sm'
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="bi bi-sliders2"></i>
                Filters
              </Button>
            </div>
          </div>

          {/* Simple stats cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Total Books</h5>
                  <h3>{books.length}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Available</h5>
                  <h3>{books.filter(b => b.status === 'Available').length}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Checked Out</h5>
                  <h3>{books.filter(b => b.status === 'Checked Out').length}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Genres</h5>
                  <h3>{new Set(books.map(b => b.genre)).size}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Search */}
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by book title..."
                  value={filters.title}
                  onChange={(e) => handleFilterChange('title', e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-person"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by author..."
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Filters */}
          <Collapse in={showFilters}>
            <div>
              <Row className="mb-4 g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Genre</Form.Label>
                    <Form.Select 
                      value={filters.genre}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                    >
                      <option value="">All</option>
                      {Object.values(BookGenre).map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All</option>
                      {Object.values(BookStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      value={filters.language}
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                    >
                      <option value="">All</option>
                      {Object.values(BookLanguage).map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col xs={12} className="text-end">
                  <Button 
                    onClick={resetFilters}
                    style={{backgroundColor: "#2c3e50", borderColor: "#2c3e50"}}
                  >
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </div>
          </Collapse>

          {/* Books Table */}
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPageBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>
                      <BookFill className="me-2" />
                      {book.title}
                    </td>
                    <td>{book.author}</td>
                    <td>{book.publicationYear}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>
                      <span className={`badge ${book.status === 'Available' ? 'bg-success' : 'bg-warning'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <i className="bi bi-geo-alt me-1"></i>
                      {book.shelfLocation}
                    </td>
                    <td>
                      <Button 
                        variant="light"
                        size="sm"
                        className="me-1"
                        onClick={() => alert(`Edit book ${book.id}`)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="light" 
                        size="sm"
                        onClick={() => alert(`Checkout book ${book.id}`)}
                      >
                        <i className="bi bi-arrow-left-right"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {currentPageBooks.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-book display-1 text-muted mb-3 d-block"></i>
                <p className="text-muted mb-0">No books found matching your search.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Row className="mt-3">
            <Col className="text-center">
              <Pagination className="justify-content-center">
                <Pagination.Prev
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: Math.ceil(filteredBooks.length / itemsPerPage) }).map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => 
                    setCurrentPage(prev => 
                      Math.min(Math.ceil(filteredBooks.length / itemsPerPage), prev + 1)
                    )
                  }
                  disabled={currentPage === Math.ceil(filteredBooks.length / itemsPerPage)}
                />
              </Pagination>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookList;
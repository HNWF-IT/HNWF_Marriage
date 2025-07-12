import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Collapse, Table, Pagination, Badge } from 'react-bootstrap';
import { Book, BookmarkCheckFill, CollectionFill, PeopleFill, Search, PersonFill, PlusCircle, Sliders, GeoAlt, PencilSquare, ArrowLeftRight, BookmarkCheck, ExclamationTriangle } from 'react-bootstrap-icons';
import BookAPI from '../../api/book';
import { useEffect } from 'react';
import BookModal from './BookModal';
import { BookGenre, BookLanguage, BookStatus } from '../../enums/libraryEnums';
import PulseDotLoader from '../commons/spinner/PulseDotLoader';
import StatsCardRow from '../commons/stats/StatsCardRow';
import CheckOutBookModal from './CheckOutBookModal';
import { toast } from 'react-toastify';
import "../../assets/css/pagination.css"

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [mode, setMode] = useState('');
  const [selectedBook, setSelectedBook] = useState({});
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    status: '',
    language: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await BookAPI.getAllBooks();
        if(response.data.success && response.data.data) {
          setBooks(response.data.data);
        }
      } catch (error) {
        const message = error?.message || "Something went wrong";
        toast.error(message);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, []);

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

  const handleBookModalClose = () => {
    setMode('');
    setSelectedBook({});
    setShowBookModal(false);
  }

  const handleBookModalShow = (openMode, candidateData) => {
    setMode(openMode);
    setSelectedBook(candidateData);
    setShowBookModal(true);
  }

  
  const handleBookAddOrUpdate = (newBook, mode) => {
    if(mode === "add") {
      setBooks((prev) => [...prev, newBook]); // Update the state
    } else if(mode === "edit") {
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book._id === newBook._id ? newBook : book
        )
      );
    }
  };

  const handleBookCheckOut = (book) => {
    setSelectedBook(book);
    setShowCheckOutModal(true);
  };

  const handleCheckOutSubmit = async (payload) => {
    try {
        const response = await BookAPI.checkoutBook(payload);
        if(response.status === 200 && response?.data?.success) {
          const updatedBook = response?.data?.data;
          if(updatedBook) {
            setBooks(prevBooks =>
              prevBooks.map(book =>
                book._id === updatedBook._id ? updatedBook : book
              )
            );
          }
          
          if(payload.mode === 'checkout') {
            toast.success("Book assigned!!!");
          } else {
            toast.success("Book returned!!!");
          }
        } else {
          toast.error("Book not assigned!!!");
        }
      } catch (error) {
        let message = error.message || 'Something went wrong';
        if(!error.response.data.success && error.response.data.message && error.status === 400) {
          message = error.response.data.message;
        }

        toast.error(message);
      }
  };

  const booksStats = [
    {
      icon: <Book size={40} className="text-warning" />,
      label: "Total Books",
      value: books.length,
      bgColor: "bg-warning-subtle",
      textColor: "text-warning"
    },
    {
      icon: <CollectionFill size={40} className="text-primary" />,
      label: "Available Books",
      value: books.filter(b => b.status === "Available").length,
      bgColor: "bg-primary-subtle",
      textColor: "text-primary"
    },
    {
      icon: <BookmarkCheckFill size={40} className="text-success" />,
      label: "Reserved",
      value: books.filter(b => b.status === "Reserved").length,
      bgColor: "bg-success-subtle",
      textColor: "text-success"
    },
    {
      icon: <PeopleFill size={40} className="text-danger" />,
      label: "Checked Out",
      value: books.filter(b => b.status === "Checked Out").length,
      bgColor: "bg-danger-subtle",
      textColor: "text-danger"
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Available':
        return <BookmarkCheck className="me-1" size={14} />;
      case 'Reserved':
        return <BookmarkCheckFill className="me-1" size={14} />;
      case 'Checked Out':
        return <PersonFill className="me-1" size={14} />;
      case 'Lost':
        return <ExclamationTriangle className="me-1" size={14} />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Available':
        return 'success';
      case 'Reserved':
        return 'warning';
      case 'Checked Out':
        return 'danger';
      case 'Lost':
        return 'secondary';
      default:
        return 'light';
    }
  };

  if(loading) {
    return <><PulseDotLoader /></>
  }

  return (
    <>
      { showBookModal ? <BookModal
        mode={mode}
        bookData={selectedBook}
        show={showBookModal}
        handleClose={handleBookModalClose}
        onBookAddOrUpdate={handleBookAddOrUpdate}
      /> : "" }

      <CheckOutBookModal 
        show={showCheckOutModal} 
        onHide={() => setShowCheckOutModal(false)}
        onSubmit={handleCheckOutSubmit}
        book={selectedBook}
        mode={selectedBook?.status === 'Checked Out' ? 'return' : 'checkout'}
      />

      <Container fluid className="px-3 px-lg-4 py-4 bg-light" style={{ 
        minHeight: '100vh'
      }}>
        <div className="mb-4">
          <h1 className="display-5 fw-bold text-dark mb-2">📚 Library Management System</h1>
          <p className="lead text-muted mb-4">Manage your book collection efficiently</p>
        </div>

        <Card className="border-0 shadow-lg" style={{ 
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.98)'
        }}>
          <Card.Body className="p-4">
            {/* Header Section */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
              <div>
                <h2 className="h3 mb-2 text-dark fw-bold">Book Collection</h2>
                <p className="text-muted mb-0">
                  {filteredBooks.length} of {books.length} books
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  variant="success" 
                  className="d-flex align-items-center shadow-sm"
                  style={{ borderRadius: '12px' }}
                  onClick={() => handleBookModalShow('add', {})}
                >
                  <PlusCircle className="me-2" size={18} />
                  Add
                </Button>

                <Button 
                  variant={showFilters ? "primary" : "outline-primary"}
                  className="d-flex align-items-center shadow-sm"
                  style={{ borderRadius: '12px' }}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Sliders className="me-2" size={18} />
                  Filters
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mb-4">
              <StatsCardRow stats={booksStats} />
            </div>

            {/* Filters Section */}
            <Collapse in={showFilters}>
              <div className="mb-4">
                <Card className="border-0 bg-light" style={{ borderRadius: '15px' }}>
                  <Card.Body className="p-4">
                    <h5 className="mb-3 text-dark fw-semibold">
                      <Sliders className="me-2" size={20} />
                      Filter Options
                    </h5>
                    <Row className="g-3">
                      <Col lg={3} md={6}>
                        <Form.Group>
                          <Form.Label className="fw-medium text-dark">Genre</Form.Label>
                          <Form.Select 
                            value={filters.genre}
                            onChange={(e) => handleFilterChange('genre', e.target.value)}
                            style={{ borderRadius: '10px' }}
                          >
                            <option value="">All Genres</option>
                            {Object.values(BookGenre).map(genre => (
                              <option key={genre} value={genre}>{genre}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <Form.Group>
                          <Form.Label className="fw-medium text-dark">Status</Form.Label>
                          <Form.Select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            style={{ borderRadius: '10px' }}
                          >
                            <option value="">All Status</option>
                            {Object.values(BookStatus).map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <Form.Group>
                          <Form.Label className="fw-medium text-dark">Language</Form.Label>
                          <Form.Select
                            value={filters.language}
                            onChange={(e) => handleFilterChange('language', e.target.value)}
                            style={{ borderRadius: '10px' }}
                          >
                            <option value="">All Languages</option>
                            {Object.values(BookLanguage).map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col lg={3} md={6} className="d-flex align-items-end">
                        <Button 
                          variant="outline-secondary"
                          className="w-100"
                          onClick={resetFilters}
                          style={{ borderRadius: '10px' }}
                        >
                          Clear Filters
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            </Collapse>

            {/* Search Section */}
            <Row className="mb-4 g-3">
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="fw-medium text-dark">Search by Title</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={{ borderRadius: '10px 0 0 10px', border: 'none', background: '#f8f9fa' }}>
                      <Search size={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Enter book title..."
                      value={filters.title}
                      onChange={(e) => handleFilterChange('title', e.target.value)}
                      style={{ borderRadius: '0 10px 10px 0', border: 'none', background: '#f8f9fa' }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="fw-medium text-dark">Search by Author</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={{ borderRadius: '10px 0 0 10px', border: 'none', background: '#f8f9fa' }}>
                      <PersonFill size={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Enter author name..."
                      value={filters.author}
                      onChange={(e) => handleFilterChange('author', e.target.value)}
                      style={{ borderRadius: '0 10px 10px 0', border: 'none', background: '#f8f9fa' }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            {/* Books Table */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="align-middle mb-0">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                        <th className="fw-semibold border-0 py-3 ps-4 text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Serial</th>
                        <th className="fw-semibold border-0 py-3 text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Book Title</th>
                        <th className="fw-semibold border-0 py-3 d-none d-md-table-cell text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Author Name</th>
                        <th className="fw-semibold border-0 py-3 d-none d-lg-table-cell text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Publication Year</th>
                        <th className="fw-semibold border-0 py-3 d-none d-md-table-cell text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Book Genre</th>
                        <th className="fw-semibold border-0 py-3 d-none d-lg-table-cell text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>ISBN Number</th>
                        <th className="fw-semibold border-0 py-3 text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Book Status</th>
                        <th className="fw-semibold border-0 py-3 d-none d-lg-table-cell text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Shelf Location</th>
                        <th className="fw-semibold border-0 py-3 pe-4 text-uppercase" style={{ 
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          color: '#6c757d'
                        }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageBooks.map((book, index) => (
                        <tr key={book.id} className="border-0" style={{ 
                          borderBottom: '1px solid #f1f3f4',
                          transition: 'all 0.2s ease'
                        }}>
                          <td className="ps-4 fw-medium text-muted">
                            {(((currentPage - 1) * 50) + (index + 1))}
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div style={{ 
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Book size={18} />
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">{book.title}</div>
                                <div className="d-md-none">
                                  <small className="text-muted">by {book.author}</small>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="d-none d-md-table-cell text-muted">{book.author}</td>
                          <td className="d-none d-lg-table-cell text-muted">{book.publicationYear}</td>
                          <td className="d-none d-md-table-cell">
                            <span className="badge bg-light text-dark border">{book.genre}</span>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            <code className="text-muted">{book.isbn}</code>
                          </td>
                          <td>
                            <Badge 
                              bg={getStatusVariant(book.status)} 
                              className="d-flex align-items-center justify-content-center"
                              style={{ 
                                width: 'fit-content',
                                padding: '8px 12px',
                                borderRadius: '20px',
                                fontSize: '12px'
                              }}
                            >
                              {getStatusIcon(book.status)}
                              {book.status}
                            </Badge>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            <div className="d-flex align-items-center">
                              {book.shelfLocation ? (
                                <>
                                  <GeoAlt className="me-1 text-muted" size={14} />
                                  <span className="text-dark">{book.shelfLocation}</span>
                                </>
                              ) : (
                                <span className="text-muted fst-italic"><b>------</b></span>
                              )}
                            </div>
                          </td>
                          <td className="pe-4">
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary"
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{ 
                                  borderRadius: '8px',
                                  width: '36px',
                                  height: '36px'
                                }}
                                onClick={() => handleBookModalShow('edit', book)}
                              >
                                <PencilSquare size={14} />
                              </Button>
                              <Button 
                                variant="outline-success"
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{ 
                                  borderRadius: '8px',
                                  width: '36px',
                                  height: '36px'
                                }}
                                onClick={() => handleBookCheckOut(book)}
                              >
                                <ArrowLeftRight size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {currentPageBooks.length === 0 && (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <Book size={64} className="text-muted opacity-50" />
                      </div>
                      <h5 className="text-muted mb-2">No books found</h5>
                      <p className="text-muted mb-0">Try adjusting your search filters</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Pagination */}
            {filteredBooks.length > itemsPerPage && (
  <div className="d-flex justify-content-center mt-4">
    <nav aria-label="Page navigation">
      <Pagination className="mb-0 modern-pagination">
        <Pagination.Prev
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          ← Previous
        </Pagination.Prev>
        
        {Array.from({ length: Math.ceil(filteredBooks.length / itemsPerPage) })
          .slice(Math.max(0, currentPage - 2), Math.min(Math.ceil(filteredBooks.length / itemsPerPage), currentPage + 1))
          .map((_, index) => {
            const pageNum = Math.max(0, currentPage - 2) + index + 1;
            return (
              <Pagination.Item
                key={pageNum}
                active={pageNum === currentPage}
                onClick={() => setCurrentPage(pageNum)}
                className="pagination-number"
              >
                {pageNum}
              </Pagination.Item>
            );
          })}
        
        <Pagination.Next
          onClick={() => 
            setCurrentPage(prev => 
              Math.min(Math.ceil(filteredBooks.length / itemsPerPage), prev + 1)
            )
          }
          disabled={currentPage === Math.ceil(filteredBooks.length / itemsPerPage)}
          className="pagination-arrow"
        >
          Next →
        </Pagination.Next>
      </Pagination>
    </nav>
  </div>
)}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default BookList;
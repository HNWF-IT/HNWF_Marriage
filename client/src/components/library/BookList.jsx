import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Collapse, Table, Pagination } from 'react-bootstrap';
import { Book, BookFill, BookmarkCheckFill, CollectionFill, PeopleFill } from 'react-bootstrap-icons';
import BookAPI from '../../api/book';
import { useEffect } from 'react';
import BookModal from './BookModal';
import { BookGenre, BookLanguage, BookStatus } from '../../enums/libraryEnums';
import PulseDotLoader from '../commons/spinner/PulseDotLoader';
import StatsCardRow from '../commons/stats/StatsCardRow';
import CheckOutBookModal from './CheckOutBookModal';
import { toast } from 'react-toastify';

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
          // sessionStorage.setItem('candidates', JSON.stringify(response.data.data));
        }
      } catch (error) {
        const message = error?.message || "Something went wrong";
        toast.error(message);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      }
    };
  
    // const cached = sessionStorage.getItem('candidates');
    // if (cached) {
    //   setCandidates(JSON.parse(cached));
    // } else {
    //   fetchCandidates();
    // }
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
        if(response?.data?.success) {
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
        const message = error?.message || "Something went wrong";
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
                  onClick={() => handleBookModalShow('add', {})}
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

            {/* Stats cards */}
            <StatsCardRow stats={booksStats} />

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
                  {currentPageBooks.map((book, index) => (
                    <tr key={book.id}>
                      <td>{index + 1}</td>
                      <td>
                        <BookFill className="me-2" />
                        {book.title}
                      </td>
                      <td>{book.author}</td>
                      <td>{book.publicationYear}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>
                        <span className={`badge ${
                          book.status === 'Available' ? 'bg-success' :
                          book.status === 'Reserved' ? 'bg-warning' :
                          book.status === 'Checked Out' ? 'bg-danger' :
                          book.status === 'Lost' ? 'bg-secondary' :
                          'bg-light text-dark' // default/fallback
                        }`}>
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
                          onClick={() => handleBookModalShow('edit', book)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm"
                          onClick={() => handleBookCheckOut(book)}
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
    </>
  );
};

export default BookList;
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Collapse,
  Table,
  Pagination,
} from "react-bootstrap";
import {
  BookFill,
  Search,
  Plus,
  Pencil,
  ArrowLeftRight,
  Sliders2,
  Person,
} from "react-bootstrap-icons";
import BookModal from "./BookModal";
import BookStatsCard from "./BookStatsCard";
import { BookStatus, BookGenre, BookLanguage } from "../../enums/BookEnums";

// Hardcoded book data
const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    genre: "Fiction",
    isbn: "9780743273565",
    status: "Available",
    shelfLocation: "FIC-101",
    language: "English",
    pageCount: 180,
    publisher: "Scribner",
    description: "A story of wealth, love, and the American Dream",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publicationYear: 1960,
    genre: "Fiction",
    isbn: "9780061120084",
    status: "Checked Out",
    shelfLocation: "FIC-102",
    language: "English",
    pageCount: 281,
    publisher: "J. B. Lippincott & Co.",
    description: "A novel about racial injustice and moral growth",
  },
];

const BookList = () => {
  const [books, setBooks] = useState(sampleBooks);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    genre: "",
    status: "",
    language: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const itemsPerPage = 5;

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      book.author.toLowerCase().includes(filters.author.toLowerCase()) &&
      (filters.genre === "" || book.genre === filters.genre) &&
      (filters.status === "" || book.status === filters.status) &&
      (filters.language === "" || book.language === filters.language)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageBooks = filteredBooks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleBookAdded = (newBook) => {
    if (newBook.id) {
      // Update existing book
      setBooks(books.map((b) => (b.id === newBook.id ? newBook : b)));
    } else {
      // Add new book
      setBooks([
        ...books,
        { ...newBook, id: Math.max(...books.map((b) => b.id)) + 1 },
      ]);
    }
    setShowModal(false);
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0" style={{ color: "#A49559" }}>
              Library Dashboard
            </h2>
            <div className="d-flex gap-3">
              <Button
                variant="outline-success"
                onClick={() => {
                  setSelectedBook(null);
                  setShowModal(true);
                }}
              >
                <Plus /> Add Book
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Sliders2 /> Filters
              </Button>
            </div>
          </div>

          {/* Replaced stats cards with BookStatsCard component */}
          <BookStatsCard books={books} />

          {/* Search and Filters */}
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by title"
                  value={filters.title}
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Person />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by author"
                  value={filters.author}
                  onChange={(e) =>
                    setFilters({ ...filters, author: e.target.value })
                  }
                />
              </InputGroup>
            </Col>
          </Row>

          <Collapse in={showFilters}>
            <div className="mb-4">
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Genre</Form.Label>
                    <Form.Select
                      value={filters.genre}
                      onChange={(e) =>
                        setFilters({ ...filters, genre: e.target.value })
                      }
                    >
                      <option value="">All Genres</option>
                      {Object.values(BookGenre).map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <option value="">All Statuses</option>
                      {Object.values(BookStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      value={filters.language}
                      onChange={(e) =>
                        setFilters({ ...filters, language: e.target.value })
                      }
                    >
                      <option value="">All Languages</option>
                      {Object.values(BookLanguage).map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
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
                  <th>Status</th>
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
                    <td>
                      <span
                        className={`badge ${
                          book.status === "Available"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setSelectedBook(book);
                          setShowModal(true);
                        }}
                      >
                        <Pencil /> Edit
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => alert(`Checkout ${book.title}`)}
                      >
                        <ArrowLeftRight /> Checkout
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {currentPageBooks.length === 0 && (
              <div className="text-center py-5">
                <BookFill size={48} className="text-muted mb-3" />
                <p className="text-muted">
                  No books found matching your search
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Row className="d-flex justify-content-between align-items-center mt-3">
            <Col className="text-center">
              <Button
                style={{ backgroundColor: "#4C6C44", border: "#4C6C44" }}
                onClick={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
                disabled={currentPage === 1}
              >
                Prev
              </Button>
            </Col>

            <Col className="text-center">
              <Pagination className="justify-content-center custom-pagination">
                {[
                  ...Array(
                    Math.ceil(filteredBooks.length / itemsPerPage)
                  ).keys(),
                ].map((number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => setCurrentPage(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Col>

            <Col className="text-center">
              <Button
                style={{ backgroundColor: "#4C6C44", border: "#4C6C44" }}
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(filteredBooks.length / itemsPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage === Math.ceil(filteredBooks.length / itemsPerPage)
                }
              >
                Next
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Book Modal */}
      <BookModal
        mode={selectedBook ? "edit" : "add"}
        bookData={selectedBook || {}}
        show={showModal}
        handleClose={() => setShowModal(false)}
        onBookAdded={handleBookAdded}
      />
    </Container>
  );
};

export default BookList;

// Pagination
//           <Pagination className="justify-content-center mt-4">
//             <Pagination.Prev
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             />
//             {[...Array(Math.ceil(filteredBooks.length / itemsPerPage)).keys()].map(num => (
//               <Pagination.Item
//                 key={num + 1}
//                 active={num + 1 === currentPage}
//                 onClick={() => setCurrentPage(num + 1)}
//               >
//                 {num + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next
//               onClick={() => setCurrentPage(p =>
//                 Math.min(Math.ceil(filteredBooks.length / itemsPerPage), p + 1)
//               )}
//               disabled={currentPage === Math.ceil(filteredBooks.length / itemsPerPage)}
//             />
//           </Pagination>
//         </Card.Body>
//       </Card>

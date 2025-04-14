import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BookStatus, BookGenre, BookLanguage } from "../../enums/BookEnums";


const BookModal = ({ mode, bookData, show, handleClose, onBookAdded }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: bookData
  });

  const onSubmit = (data) => {
    onBookAdded({
      ...bookData,
      ...data,
      id: mode === "edit" ? bookData.id : undefined // Preserve ID for edits
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{backgroundColor: "#4C6C44", color: "white"}}>
        <Modal.Title>{mode === "edit" ? "Edit Book" : "Add New Book"}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h5 style={{color: "#A49559"}}>Basic Information</h5>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  {...register("title", { required: "Title is required" })}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  {...register("author", { required: "Author is required" })}
                  isInvalid={!!errors.author}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.author?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  {...register("isbn", { 
                    required: "ISBN is required",
                    pattern: {
                      value: /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)/,
                      message: "Invalid ISBN format"
                    }
                  })}
                  isInvalid={!!errors.isbn}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.isbn?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Publication Year</Form.Label>
                <Form.Control
                  type="number"
                  {...register("publicationYear", { 
                    required: "Publication year is required",
                    min: {
                      value: 1000,
                      message: "Year must be after 1000"
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: "Year cannot be in the future"
                    }
                  })}
                  isInvalid={!!errors.publicationYear}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.publicationYear?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <h5 style={{color: "#A49559"}}>Classification</h5>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Select
                  {...register("genre", { required: "Genre is required" })}
                  isInvalid={!!errors.genre}
                >
                  <option value="">Select Genre</option>
                  {Object.values(BookGenre).map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.genre?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Language</Form.Label>
                <Form.Select
                  {...register("language", { required: "Language is required" })}
                  isInvalid={!!errors.language}
                >
                  <option value="">Select Language</option>
                  {Object.values(BookLanguage).map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.language?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Page Count</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  {...register("pageCount", { 
                    required: "Page count is required",
                    min: {
                      value: 1,
                      message: "Must have at least 1 page"
                    }
                  })}
                  isInvalid={!!errors.pageCount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.pageCount?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <h5 style={{color: "#A49559"}}>Inventory Information</h5>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  {...register("status", { required: "Status is required" })}
                  isInvalid={!!errors.status}
                >
                  <option value="">Select Status</option>
                  {Object.values(BookStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shelf Location</Form.Label>
                <Form.Control
                  {...register("shelfLocation", { required: "Shelf location is required" })}
                  isInvalid={!!errors.shelfLocation}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.shelfLocation?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <h5 style={{color: "#A49559"}}>Additional Information</h5>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register("description")}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" style={{backgroundColor: "#2c3e50", borderColor: "#2c3e50"}}>
              {mode === "edit" ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookModal;